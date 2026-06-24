// src/screens/events/AddEventScreen.js — FIXED keyboard dismissing issue
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Platform, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

const COLORS = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };
const EVENT_TYPES = ['wedding','conference','party','meeting','other'];
const STATUSES    = ['scheduled','completed','cancelled'];

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

export default function AddEventScreen({ route, navigation }) {
  const existing = route.params?.event;
  const isEdit   = !!existing;

  const [halls,    setHalls]    = useState([]);
  const [title,    setTitle]    = useState(existing?.title        || '');
  const [evType,   setEvType]   = useState(existing?.event_type   || 'meeting');
  const [hallId,   setHallId]   = useState(existing?.hall?._id   || '');
  const [cliName,  setCliName]  = useState(existing?.client_name  || '');
  const [cliEmail, setCliEmail] = useState(existing?.client_email || '');
  const [evDate,   setEvDate]   = useState(existing?.event_date?.slice(0,10) || '');
  const [startT,   setStartT]   = useState(existing?.start_time  || '');
  const [endT,     setEndT]     = useState(existing?.end_time    || '');
  const [guests,   setGuests]   = useState(existing?.guest_count?.toString() || '');
  const [price,    setPrice]    = useState(existing?.total_price?.toString() || '');
  const [notes,    setNotes]    = useState(existing?.notes       || '');
  const [status,   setStatus]   = useState(existing?.status      || 'scheduled');
  const [loading,  setLoading]  = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [errors,   setErrors]   = useState({});

  useEffect(() => {
    api.get('/events/halls').then(({data}) => {
      setHalls(data.data||[]);
      if(!isEdit && data.data?.length) setHallId(data.data[0]._id);
    }).catch(()=>{});
  }, []);

  const validate = () => {
    const e = {};
    if (!title.trim())   e.title   = 'Event title is required.';
    if (!hallId)         e.hall    = 'Please select a hall.';
    if (!evDate)         e.evDate  = 'Event date is required.';
    if (!startT)         e.startT  = 'Start time is required. (e.g. 09:00)';
    if (!endT)           e.endT    = 'End time is required. (e.g. 17:00)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: title.trim(), event_type: evType, hall: hallId,
        client_name: cliName.trim(), client_email: cliEmail.trim(),
        event_date: evDate, start_time: startT.trim(), end_time: endT.trim(),
        guest_count: guests ? parseInt(guests) : undefined,
        total_price: price  ? parseFloat(price) : undefined,
        notes: notes.trim(), status,
      };
      if (isEdit) {
        await api.put(`/events/${existing._id}`, payload);
        Alert.alert('Updated!','Event updated.',[{text:'OK',onPress:()=>navigation.goBack()}]);
      } else {
        await api.post('/events', payload);
        Alert.alert('Created!','Event created.',[{text:'OK',onPress:()=>navigation.goBack()}]);
      }
    } catch(e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  // ── KEY FIX: no KeyboardAvoidingView wrapping ScrollView ──
  // Use ScrollView alone with keyboardShouldPersistTaps="handled"
  // This prevents the keyboard from dismissing when tapping chips/buttons
  return (
    <View style={{flex:1,backgroundColor:COLORS.bg}}>
      <ScrollView
        contentContainerStyle={{padding:16,paddingBottom:60}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {/* Validation summary */}
        {Object.keys(errors).length>0&&(
          <View style={styles.errBanner}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c"/>
            <Text style={styles.errBannerText}> Fix {Object.keys(errors).length} error{Object.keys(errors).length>1?'s':''} below</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.label}>Event Title *</Text>
        <View style={[styles.inputRow,errors.title&&styles.inputRowErr]}>
          <Ionicons name="text-outline" size={18} color="#888" style={{marginRight:8}}/>
          <TextInput style={styles.input} placeholder="e.g. Annual Conference 2026" placeholderTextColor="#aaa" value={title} onChangeText={t=>{setTitle(t);setErrors(e=>({...e,title:null}));}} returnKeyType="next"/>
        </View>
        {errors.title&&<Text style={styles.et}>⚠ {errors.title}</Text>}

        {/* Client Name */}
        <Text style={styles.label}>Client Name</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={18} color="#888" style={{marginRight:8}}/>
          <TextInput style={styles.input} placeholder="Client full name" placeholderTextColor="#aaa" value={cliName} onChangeText={setCliName} returnKeyType="next"/>
        </View>

        {/* Client Email */}
        <Text style={styles.label}>Client Email</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={18} color="#888" style={{marginRight:8}}/>
          <TextInput style={styles.input} placeholder="client@email.com" placeholderTextColor="#aaa" value={cliEmail} onChangeText={setCliEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next"/>
        </View>

        {/* Event Date — Calendar Picker */}
        <Text style={styles.label}>Event Date *</Text>
        <Pressable style={[styles.dateBtn,errors.evDate&&styles.inputRowErr]} onPress={()=>setShowDate(true)}>
          <Ionicons name="calendar-outline" size={18} color={evDate?COLORS.primary:'#aaa'} style={{marginRight:8}}/>
          <Text style={{flex:1,color:evDate?COLORS.primary:'#aaa',fontWeight:evDate?'600':'400',fontSize:15}}>{evDate||'Tap to select date'}</Text>
          <Ionicons name="chevron-down-outline" size={16} color="#888"/>
        </Pressable>
        {errors.evDate&&<Text style={styles.et}>⚠ {errors.evDate}</Text>}

        {/* Start / End Time */}
        <View style={{flexDirection:'row',gap:12}}>
          <View style={{flex:1}}>
            <Text style={styles.label}>Start Time *</Text>
            <View style={[styles.inputRow,errors.startT&&styles.inputRowErr]}>
              <Ionicons name="time-outline" size={16} color="#888" style={{marginRight:6}}/>
              <TextInput style={styles.input} placeholder="09:00" placeholderTextColor="#aaa" value={startT} onChangeText={t=>{setStartT(t);setErrors(e=>({...e,startT:null}));}} returnKeyType="next"/>
            </View>
            {errors.startT&&<Text style={styles.et}>⚠ {errors.startT}</Text>}
          </View>
          <View style={{flex:1}}>
            <Text style={styles.label}>End Time *</Text>
            <View style={[styles.inputRow,errors.endT&&styles.inputRowErr]}>
              <Ionicons name="time-outline" size={16} color="#888" style={{marginRight:6}}/>
              <TextInput style={styles.input} placeholder="17:00" placeholderTextColor="#aaa" value={endT} onChangeText={t=>{setEndT(t);setErrors(e=>({...e,endT:null}));}} returnKeyType="next"/>
            </View>
            {errors.endT&&<Text style={styles.et}>⚠ {errors.endT}</Text>}
          </View>
        </View>

        {/* Guest Count & Price */}
        <View style={{flexDirection:'row',gap:12}}>
          <View style={{flex:1}}>
            <Text style={styles.label}>Guest Count</Text>
            <View style={styles.inputRow}>
              <Ionicons name="people-outline" size={16} color="#888" style={{marginRight:6}}/>
              <TextInput style={styles.input} placeholder="150" placeholderTextColor="#aaa" value={guests} onChangeText={setGuests} keyboardType="numeric" returnKeyType="next"/>
            </View>
          </View>
          <View style={{flex:1}}>
            <Text style={styles.label}>Total Price (LKR)</Text>
            <View style={styles.inputRow}>
              <Ionicons name="cash-outline" size={16} color="#888" style={{marginRight:6}}/>
              <TextInput style={styles.input} placeholder="250000" placeholderTextColor="#aaa" value={price} onChangeText={setPrice} keyboardType="numeric" returnKeyType="next"/>
            </View>
          </View>
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <View style={[styles.inputRow,{alignItems:'flex-start',paddingTop:10}]}>
          <Ionicons name="chatbox-outline" size={16} color="#888" style={{marginRight:8,marginTop:2}}/>
          <TextInput style={[styles.input,{height:80,textAlignVertical:'top'}]} placeholder="Additional notes..." placeholderTextColor="#aaa" value={notes} onChangeText={setNotes} multiline/>
        </View>

        {/* Event Type */}
        <Text style={[styles.label,{marginTop:8}]}>Event Type *</Text>
        <View style={styles.chipsRow}>
          {EVENT_TYPES.map(t=>(
            <Pressable key={t} style={[styles.chip,evType===t&&styles.chipActive]} onPress={()=>setEvType(t)}>
              <Text style={[styles.chipText,evType===t&&styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Hall */}
        <Text style={styles.label}>Select Hall *</Text>
        {errors.hall&&<Text style={styles.et}>⚠ {errors.hall}</Text>}
        {halls.map(h=>{
          const sel = hallId===h._id;
          return (
            <Pressable key={h._id} style={[styles.hallRow,sel&&styles.hallRowActive]} onPress={()=>{setHallId(h._id);setErrors(e=>({...e,hall:null}));}}>
              <View style={[styles.radio,sel&&styles.radioActive]}>{sel&&<View style={styles.radioDot}/>}</View>
              <View style={{flex:1}}>
                <Text style={[styles.hallName,sel&&{color:'#fff'}]}>{h.name}</Text>
                <Text style={[styles.hallSub,sel&&{color:'#aac4e0'}]}>Capacity: {h.capacity} · LKR {h.price_per_hour}/hr</Text>
              </View>
              {sel&&<Ionicons name="checkmark-circle" size={22} color={COLORS.accent}/>}
            </Pressable>
          );
        })}

        {/* Status (edit only) */}
        {isEdit&&(
          <>
            <Text style={[styles.label,{marginTop:8}]}>Status</Text>
            <View style={styles.chipsRow}>
              {STATUSES.map(s=>(
                <Pressable key={s} style={[styles.chip,status===s&&styles.chipActive]} onPress={()=>setStatus(s)}>
                  <Text style={[styles.chipText,status===s&&styles.chipTextActive]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:(
            <><Ionicons name="save-outline" size={20} color="#fff"/><Text style={styles.saveBtnText}>  {isEdit?'Update Event':'Create Event'}</Text></>
          )}
        </TouchableOpacity>
      </ScrollView>

      <DatePickerModal visible={showDate} title="Event Date" onSelect={d=>{setEvDate(d);setErrors(e=>({...e,evDate:null}));}} onClose={()=>setShowDate(false)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  label:{color:COLORS.primary,fontWeight:'700',fontSize:13,marginBottom:6},
  et:{color:'#e74c3c',fontSize:11,marginBottom:8},
  errBanner:{flexDirection:'row',alignItems:'center',backgroundColor:'#fdedec',borderRadius:8,padding:10,marginBottom:14},
  errBannerText:{color:'#e74c3c',fontWeight:'600',fontSize:13},
  inputRow:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:10,paddingHorizontal:14,borderWidth:1,borderColor:'#dde6f0',marginBottom:14,height:48},
  inputRowErr:{borderColor:'#e74c3c',borderWidth:1.5},
  input:{flex:1,height:48,color:'#333',fontSize:14},
  dateBtn:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:10,paddingHorizontal:14,paddingVertical:14,borderWidth:1,borderColor:'#dde6f0',marginBottom:14},
  chipsRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20},
  chip:{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:'#dde6f0'},
  chipActive:{backgroundColor:COLORS.primary},
  chipText:{color:'#555',fontWeight:'600',fontSize:12},
  chipTextActive:{color:'#fff'},
  hallRow:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:12,padding:14,marginBottom:10,borderWidth:2,borderColor:'transparent',elevation:2},
  hallRowActive:{backgroundColor:COLORS.primary,borderColor:COLORS.accent},
  radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#bbb',marginRight:12,justifyContent:'center',alignItems:'center'},
  radioActive:{borderColor:COLORS.accent},
  radioDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.accent},
  hallName:{fontSize:15,fontWeight:'700',color:COLORS.primary},
  hallSub:{fontSize:12,color:'#888',marginTop:2},
  saveBtn:{backgroundColor:COLORS.accent,borderRadius:12,height:54,flexDirection:'row',justifyContent:'center',alignItems:'center',elevation:4,marginTop:8},
  saveBtnText:{color:'#fff',fontSize:17,fontWeight:'bold'},
});
