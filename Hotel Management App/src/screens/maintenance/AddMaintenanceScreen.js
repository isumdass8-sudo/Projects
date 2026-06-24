// src/screens/maintenance/AddMaintenanceScreen.js — with Date Picker
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

const COLORS = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };

function DatePickerModal({ visible, title, onSelect, onClose }) {
  const [year, setYear]   = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay]     = useState(new Date().getDate());
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const confirm = () => {
    const pad = n => String(n).padStart(2,'0');
    onSelect(`${year}-${pad(month+1)}-${pad(day)}`);
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={dp.overlay}>
        <View style={dp.modal}>
          <Text style={dp.title}>{title}</Text>
          <Text style={dp.label}>Year</Text>
          <View style={dp.row}>
            {[2026,2027,2028].map(y=>(
              <Pressable key={y} style={[dp.chip,year===y&&dp.chipActive]} onPress={()=>setYear(y)}>
                <Text style={[dp.chipText,year===y&&dp.chipTextActive]}>{y}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={dp.label}>Month</Text>
          <View style={dp.row}>
            {MONTHS.map((m,i)=>(
              <Pressable key={i} style={[dp.chip,month===i&&dp.chipActive]} onPress={()=>setMonth(i)}>
                <Text style={[dp.chipText,month===i&&dp.chipTextActive]}>{m}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={dp.label}>Day</Text>
          <View style={dp.dayGrid}>
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>(
              <Pressable key={d} style={[dp.dayChip,day===d&&dp.chipActive]} onPress={()=>setDay(d)}>
                <Text style={[dp.chipText,day===d&&dp.chipTextActive]}>{d}</Text>
              </Pressable>
            ))}
          </View>
          <View style={dp.btnRow}>
            <Pressable style={dp.cancelBtn} onPress={onClose}><Text style={dp.cancelText}>Cancel</Text></Pressable>
            <Pressable style={dp.confirmBtn} onPress={confirm}><Text style={dp.confirmText}>Confirm</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const dp = StyleSheet.create({
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'},
  modal:{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,padding:24},
  title:{fontSize:18,fontWeight:'bold',color:COLORS.primary,marginBottom:16,textAlign:'center'},
  label:{color:'#888',fontSize:12,fontWeight:'700',marginBottom:8,marginTop:8},
  row:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:8},
  dayGrid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:16},
  chip:{paddingHorizontal:12,paddingVertical:7,borderRadius:8,backgroundColor:'#f0f4f8'},
  dayChip:{width:38,height:38,borderRadius:8,backgroundColor:'#f0f4f8',justifyContent:'center',alignItems:'center'},
  chipActive:{backgroundColor:COLORS.primary},
  chipText:{color:'#555',fontWeight:'600',fontSize:13},
  chipTextActive:{color:'#fff'},
  btnRow:{flexDirection:'row',gap:12,marginTop:8},
  cancelBtn:{flex:1,borderRadius:10,height:48,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#ddd'},
  cancelText:{color:'#888',fontWeight:'600'},
  confirmBtn:{flex:1,borderRadius:10,height:48,justifyContent:'center',alignItems:'center',backgroundColor:COLORS.accent},
  confirmText:{color:'#fff',fontWeight:'bold',fontSize:15},
});

export default function AddMaintenanceScreen({ navigation }) {
  const [rooms,      setRooms]      = useState([]);
  const [staff,      setStaff]      = useState([]);
  const [roomId,     setRoomId]     = useState('');
  const [reason,     setReason]     = useState('');
  const [startDate,  setStartDate]  = useState('');
  const [staffId,    setStaffId]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [showDate,   setShowDate]   = useState(false);
  const [errors,     setErrors]     = useState({});

  useEffect(() => {
    Promise.all([api.get('/rooms'), api.get('/users')]).then(([r, u]) => {
      setRooms((r.data.data||[]).filter(r=>r.status!=='maintenance'));
      setStaff((u.data.data||[]).filter(s=>s.is_active));
    }).catch(()=>{});
  }, []);

  const validate = () => {
    const e = {};
    if (!roomId)          e.room      = 'Please select a room.';
    if (!reason.trim())   e.reason    = 'Reason is required.';
    if (reason.trim().length < 5) e.reason = 'Please describe the issue (min 5 chars).';
    if (!startDate)       e.startDate = 'Please select a start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSchedule = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/rooms/maintenance', {
        room_id: roomId, reason: reason.trim(),
        start_date: startDate,
        assigned_staff_id: staffId || undefined,
      });
      Alert.alert('Scheduled! ✅','Maintenance scheduled and room marked as under maintenance.',[
        {text:'OK', onPress:()=>navigation.goBack()},
      ]);
    } catch(e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <ScrollView style={styles.container} contentContainerStyle={{padding:16,paddingBottom:40}} keyboardShouldPersistTaps="handled">

        {/* Room selection */}
        <Text style={styles.label}>Select Room * {roomId?'✅':''}</Text>
        {errors.room&&<Text style={styles.et}>⚠ {errors.room}</Text>}
        {rooms.length===0&&<Text style={styles.noData}>No rooms available for maintenance.</Text>}
        {rooms.map(r=>{
          const sel = roomId===r._id;
          return (
            <Pressable key={r._id} style={[styles.roomRow,sel&&styles.roomRowActive]} onPress={()=>{setRoomId(r._id);setErrors(e=>({...e,room:null}));}}>
              <View style={[styles.radio,sel&&styles.radioActive]}>{sel&&<View style={styles.radioDot}/>}</View>
              <View style={{flex:1}}>
                <Text style={[styles.roomNum,sel&&{color:'#fff'}]}>Room #{r.room_number} — {r.room_type?.type_name}</Text>
                <Text style={[styles.roomSub,sel&&{color:'#aac4e0'}]}>Floor {r.floor||'—'} · {r.status}</Text>
              </View>
              {sel&&<Ionicons name="checkmark-circle" size={22} color={COLORS.accent}/>}
            </Pressable>
          );
        })}

        {/* Reason */}
        <Text style={[styles.label,{marginTop:16}]}>Reason / Description *</Text>
        <View style={[styles.textAreaWrap,errors.reason&&{borderColor:'#e74c3c',borderWidth:1.5}]}>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the maintenance issue in detail..."
            placeholderTextColor="#aaa"
            value={reason}
            onChangeText={t=>{setReason(t);setErrors(e=>({...e,reason:null}));}}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        {errors.reason&&<Text style={styles.et}>⚠ {errors.reason}</Text>}

        {/* Start Date — CALENDAR PICKER */}
        <Text style={styles.label}>Start Date *</Text>
        <Pressable style={[styles.dateBtn,errors.startDate&&{borderColor:'#e74c3c',borderWidth:1.5}]} onPress={()=>setShowDate(true)}>
          <Ionicons name="calendar-outline" size={18} color={startDate?COLORS.primary:'#aaa'} style={{marginRight:10}}/>
          <Text style={{flex:1,fontSize:15,color:startDate?COLORS.primary:'#aaa',fontWeight:startDate?'600':'400'}}>
            {startDate||'Tap to select date'}
          </Text>
          <Ionicons name="chevron-down-outline" size={16} color="#888"/>
        </Pressable>
        {errors.startDate&&<Text style={styles.et}>⚠ {errors.startDate}</Text>}

        {/* Assign staff */}
        <Text style={[styles.label,{marginTop:8}]}>Assign Staff (optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:24}}>
          <Pressable style={[styles.staffChip,!staffId&&styles.staffChipActive]} onPress={()=>setStaffId('')}>
            <Text style={[styles.staffChipText,!staffId&&styles.staffChipTextActive]}>Unassigned</Text>
          </Pressable>
          {staff.map(s=>(
            <Pressable key={s._id} style={[styles.staffChip,staffId===s._id&&styles.staffChipActive]} onPress={()=>setStaffId(s._id)}>
              <Text style={[styles.staffChipText,staffId===s._id&&styles.staffChipTextActive]}>{s.full_name}</Text>
              <Text style={[styles.staffRole,staffId===s._id&&{color:'#cce0f0'}]}>{s.role}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.btn} onPress={handleSchedule} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:(
            <><Ionicons name="construct-outline" size={20} color="#fff"/><Text style={styles.btnText}>  Schedule Maintenance</Text></>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DatePickerModal visible={showDate} title="Select Start Date" onSelect={d=>{setStartDate(d);setErrors(e=>({...e,startDate:null}));}} onClose={()=>setShowDate(false)}/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg},
  label:{color:COLORS.primary,fontWeight:'700',fontSize:13,marginBottom:8},
  et:{color:'#e74c3c',fontSize:11,marginBottom:8},
  noData:{color:'#aaa',marginBottom:12},
  roomRow:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:12,padding:14,marginBottom:10,borderWidth:2,borderColor:'transparent',elevation:2},
  roomRowActive:{backgroundColor:COLORS.primary,borderColor:COLORS.accent},
  radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#bbb',marginRight:12,justifyContent:'center',alignItems:'center'},
  radioActive:{borderColor:COLORS.accent},
  radioDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.accent},
  roomNum:{fontSize:15,fontWeight:'700',color:COLORS.primary},
  roomSub:{fontSize:12,color:'#888',marginTop:2},
  textAreaWrap:{backgroundColor:'#fff',borderRadius:10,borderWidth:1,borderColor:'#dde6f0',padding:12,marginBottom:4},
  textArea:{color:'#333',fontSize:14,minHeight:100},
  dateBtn:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:10,paddingHorizontal:14,paddingVertical:14,borderWidth:1,borderColor:'#dde6f0',marginBottom:4},
  staffChip:{backgroundColor:'#dde6f0',borderRadius:10,padding:12,marginRight:8,alignItems:'center',minWidth:90},
  staffChipActive:{backgroundColor:COLORS.primary},
  staffChipText:{color:'#555',fontWeight:'600',fontSize:13},
  staffChipTextActive:{color:'#fff'},
  staffRole:{color:'#888',fontSize:10,marginTop:2},
  btn:{backgroundColor:COLORS.accent,borderRadius:12,height:54,flexDirection:'row',justifyContent:'center',alignItems:'center',elevation:4},
  btnText:{color:'#fff',fontSize:17,fontWeight:'bold'},
});
