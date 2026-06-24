// src/screens/reservations/ReservationDetailScreen.js — Update + Validation + Date Picker
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator,
  TextInput, Modal, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const COLORS = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };
const STATUS_COLOR = {
  reserved:    { bg: '#ebf5fb', text: '#3498db' },
  checked_in:  { bg: '#eafaf1', text: '#27ae60' },
  checked_out: { bg: '#f5eef8', text: '#9b59b6' },
  cancelled:   { bg: '#fdedec', text: '#e74c3c' },
};

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

export default function ReservationDetailScreen({ route, navigation }) {
  const { reservation: r } = route.params;
  const { user } = useAuth();
  const isStaff = user?.role === 'admin' || user?.role === 'receptionist';

  const [editing,      setEditing]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [guestName,    setGuestName]    = useState(r.guest_name || '');
  const [guestEmail,   setGuestEmail]   = useState(r.guest_email || '');
  const [guestPhone,   setGuestPhone]   = useState(r.guest_phone || '');
  const [checkIn,      setCheckIn]      = useState(r.check_in_date?.slice(0,10) || '');
  const [checkOut,     setCheckOut]     = useState(r.check_out_date?.slice(0,10) || '');
  const [specialReq,   setSpecialReq]   = useState(r.special_requests || '');
  const [showCI,       setShowCI]       = useState(false);
  const [showCO,       setShowCO]       = useState(false);
  const [errors,       setErrors]       = useState({});

  const s = STATUS_COLOR[r.status] || STATUS_COLOR.reserved;
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut)-new Date(checkIn))/86400000) : 0;

  const validate = () => {
    const e = {};
    if (!guestName.trim())                                  e.guestName  = 'Guest name is required.';
    if (guestEmail && !guestEmail.includes('@'))            e.guestEmail = 'Enter a valid email address.';
    if (guestPhone && guestPhone.replace(/\D/g,'').length < 9) e.guestPhone = 'Enter a valid phone number (min 9 digits).';
    if (!checkIn)                                           e.checkIn    = 'Check-in date is required.';
    if (!checkOut)                                          e.checkOut   = 'Check-out date is required.';
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut))
                                                            e.checkOut   = 'Check-out must be after check-in date.';
    if (nights > 60)                                        e.checkOut   = 'Maximum stay is 60 nights.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put(`/reservations/${r._id}`, {
        guest_name: guestName.trim(), guest_email: guestEmail.trim(),
        guest_phone: guestPhone.trim(), check_in_date: checkIn,
        check_out_date: checkOut, special_requests: specialReq.trim(),
      });
      Alert.alert('Updated! ✅','Reservation updated successfully.',[
        {text:'OK', onPress:()=>navigation.goBack()},
      ]);
    } catch(e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  const Row = ({icon,label,value}) => (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={COLORS.primary} style={{width:22}}/>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value||'—'}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:40}}>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.badge,{backgroundColor:s.bg}]}>
            <Text style={[styles.badgeText,{color:s.text}]}>{r.status.replace('_',' ').toUpperCase()}</Text>
          </View>
          <Text style={styles.guestName}>{r.guest_name}</Text>
          <Text style={styles.roomInfo}>Room {r.room?.room_number} · {r.room?.room_type?.type_name}</Text>
          <Text style={styles.nightsText}>{Math.ceil((new Date(r.check_out_date)-new Date(r.check_in_date))/86400000)} Nights</Text>
        </View>

        {/* Toggle edit/view */}
        {isStaff && r.status==='reserved' && (
          <View style={styles.toggle}>
            <Pressable style={[styles.toggleBtn,!editing&&styles.toggleBtnActive]} onPress={()=>{setEditing(false);setErrors({});}}>
              <Ionicons name="eye-outline" size={15} color={!editing?'#fff':'#555'}/>
              <Text style={[styles.toggleText,!editing&&styles.toggleTextActive]}> View</Text>
            </Pressable>
            <Pressable style={[styles.toggleBtn,editing&&styles.toggleBtnActive]} onPress={()=>setEditing(true)}>
              <Ionicons name="pencil-outline" size={15} color={editing?'#fff':'#555'}/>
              <Text style={[styles.toggleText,editing&&styles.toggleTextActive]}> Edit</Text>
            </Pressable>
          </View>
        )}

        {/* VIEW MODE */}
        {!editing && <>
          <View style={styles.card}>
            <Text style={styles.section}>👤 Guest Information</Text>
            <Row icon="person-outline" label="Name"  value={r.guest_name}/>
            <Row icon="mail-outline"   label="Email" value={r.guest_email}/>
            <Row icon="call-outline"   label="Phone" value={r.guest_phone}/>
          </View>
          <View style={styles.card}>
            <Text style={styles.section}>🛏 Stay Details</Text>
            <Row icon="log-in-outline"  label="Check-in"  value={new Date(r.check_in_date).toDateString()}/>
            <Row icon="log-out-outline" label="Check-out" value={new Date(r.check_out_date).toDateString()}/>
            <Row icon="moon-outline"    label="Nights"    value={String(Math.ceil((new Date(r.check_out_date)-new Date(r.check_in_date))/86400000))}/>
            <Row icon="cash-outline"    label="Rate"      value={`LKR ${r.room?.price_per_night?.toLocaleString()}/night`}/>
          </View>
          {r.special_requests&&<View style={styles.card}><Text style={styles.section}>📝 Special Requests</Text><Text style={styles.notes}>{r.special_requests}</Text></View>}
        </>}

        {/* EDIT MODE */}
        {editing && (
          <View style={styles.card}>
            <Text style={styles.section}>✏️ Edit Reservation</Text>

            {Object.keys(errors).length>0&&(
              <View style={styles.errBanner}>
                <Ionicons name="alert-circle" size={16} color="#e74c3c"/>
                <Text style={styles.errBannerText}> Fix {Object.keys(errors).length} error{Object.keys(errors).length>1?'s':''} below</Text>
              </View>
            )}

            {/* Guest Name */}
            <Text style={styles.fl}>Guest Name *</Text>
            <TextInput style={[styles.fi, errors.guestName&&styles.fiErr]} value={guestName} onChangeText={t=>{setGuestName(t);setErrors(e=>({...e,guestName:null}));}} placeholder="Full name" placeholderTextColor="#aaa"/>
            {errors.guestName&&<Text style={styles.et}>⚠ {errors.guestName}</Text>}

            {/* Email */}
            <Text style={styles.fl}>Email</Text>
            <TextInput style={[styles.fi,errors.guestEmail&&styles.fiErr]} value={guestEmail} onChangeText={t=>{setGuestEmail(t);setErrors(e=>({...e,guestEmail:null}));}} placeholder="email@example.com" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none"/>
            {errors.guestEmail&&<Text style={styles.et}>⚠ {errors.guestEmail}</Text>}

            {/* Phone */}
            <Text style={styles.fl}>Phone</Text>
            <TextInput style={[styles.fi,errors.guestPhone&&styles.fiErr]} value={guestPhone} onChangeText={t=>{setGuestPhone(t);setErrors(e=>({...e,guestPhone:null}));}} placeholder="07X XXX XXXX" placeholderTextColor="#aaa" keyboardType="phone-pad"/>
            {errors.guestPhone&&<Text style={styles.et}>⚠ {errors.guestPhone}</Text>}

            {/* Check-in */}
            <Text style={styles.fl}>Check-in Date *</Text>
            <Pressable style={[styles.dateBtn,errors.checkIn&&styles.fiErr]} onPress={()=>setShowCI(true)}>
              <Ionicons name="calendar-outline" size={16} color={checkIn?COLORS.primary:'#aaa'} style={{marginRight:8}}/>
              <Text style={{flex:1,color:checkIn?COLORS.primary:'#aaa',fontWeight:checkIn?'600':'400'}}>{checkIn||'Tap to select'}</Text>
              <Ionicons name="chevron-down-outline" size={14} color="#888"/>
            </Pressable>
            {errors.checkIn&&<Text style={styles.et}>⚠ {errors.checkIn}</Text>}

            {/* Check-out */}
            <Text style={styles.fl}>Check-out Date *</Text>
            <Pressable style={[styles.dateBtn,errors.checkOut&&styles.fiErr]} onPress={()=>setShowCO(true)}>
              <Ionicons name="calendar-outline" size={16} color={checkOut?COLORS.primary:'#aaa'} style={{marginRight:8}}/>
              <Text style={{flex:1,color:checkOut?COLORS.primary:'#aaa',fontWeight:checkOut?'600':'400'}}>{checkOut||'Tap to select'}</Text>
              <Ionicons name="chevron-down-outline" size={14} color="#888"/>
            </Pressable>
            {errors.checkOut&&<Text style={styles.et}>⚠ {errors.checkOut}</Text>}

            {nights>0&&(
              <View style={styles.nightBanner}>
                <Ionicons name="moon-outline" size={14} color={COLORS.accent}/>
                <Text style={styles.nightBannerText}>  {nights} night{nights!==1?'s':''} · Est. LKR {((r.room?.price_per_night||0)*nights).toLocaleString()}</Text>
              </View>
            )}

            {/* Special Requests */}
            <Text style={styles.fl}>Special Requests</Text>
            <TextInput style={[styles.fi,{height:80,textAlignVertical:'top'}]} value={specialReq} onChangeText={setSpecialReq} placeholder="Any special requests?" placeholderTextColor="#aaa" multiline/>

            <Pressable style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
              {loading?<ActivityIndicator color="#fff"/>:<><Ionicons name="save-outline" size={18} color="#fff"/><Text style={styles.saveBtnText}> Save Changes</Text></>}
            </Pressable>
            <Pressable style={styles.cancelBtn2} onPress={()=>{setEditing(false);setErrors({});}}>
              <Text style={styles.cancelBtn2Text}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <DatePickerModal visible={showCI}  title="Check-in Date"  onSelect={d=>{setCheckIn(d); setErrors(e=>({...e,checkIn:null}));}}  onClose={()=>setShowCI(false)}/>
      <DatePickerModal visible={showCO}  title="Check-out Date" onSelect={d=>{setCheckOut(d);setErrors(e=>({...e,checkOut:null}));}} onClose={()=>setShowCO(false)}/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg},
  header:{backgroundColor:COLORS.primary,padding:24,alignItems:'center'},
  badge:{borderRadius:12,paddingHorizontal:14,paddingVertical:5,marginBottom:10},
  badgeText:{fontWeight:'bold',fontSize:12},
  guestName:{color:'#fff',fontSize:22,fontWeight:'bold'},
  roomInfo:{color:'#aac4e0',fontSize:14,marginTop:4},
  nightsText:{color:COLORS.accent,fontSize:18,fontWeight:'bold',marginTop:6},
  toggle:{flexDirection:'row',margin:12,backgroundColor:'#fff',borderRadius:12,padding:4,elevation:2},
  toggleBtn:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:10,borderRadius:10},
  toggleBtnActive:{backgroundColor:COLORS.primary},
  toggleText:{color:'#555',fontWeight:'600',fontSize:14},
  toggleTextActive:{color:'#fff'},
  card:{backgroundColor:'#fff',margin:12,borderRadius:14,padding:16,elevation:2},
  section:{fontSize:14,fontWeight:'bold',color:COLORS.primary,marginBottom:14,borderBottomWidth:1,borderColor:'#eee',paddingBottom:8},
  row:{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderColor:'#f8f8f8'},
  rowLabel:{color:'#888',fontSize:13,flex:1,marginLeft:6},
  rowValue:{color:'#2c3e50',fontSize:13,fontWeight:'600',flex:2,textAlign:'right'},
  notes:{color:'#555',fontSize:14,lineHeight:21},
  errBanner:{flexDirection:'row',alignItems:'center',backgroundColor:'#fdedec',borderRadius:8,padding:10,marginBottom:14},
  errBannerText:{color:'#e74c3c',fontWeight:'600',fontSize:13},
  fl:{color:COLORS.primary,fontWeight:'700',fontSize:12,marginBottom:5},
  fi:{borderWidth:1,borderColor:'#dde6f0',borderRadius:10,paddingHorizontal:14,height:48,color:'#333',fontSize:14,backgroundColor:'#f9f9f9',marginBottom:4},
  fiErr:{borderColor:'#e74c3c',borderWidth:1.5},
  et:{color:'#e74c3c',fontSize:11,marginBottom:10},
  dateBtn:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#dde6f0',borderRadius:10,paddingHorizontal:14,paddingVertical:14,backgroundColor:'#f9f9f9',marginBottom:4},
  nightBanner:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff8ee',borderRadius:8,padding:10,marginBottom:14,borderWidth:1,borderColor:'#f5d5a0'},
  nightBannerText:{color:COLORS.primary,fontWeight:'700',fontSize:13},
  saveBtn:{backgroundColor:COLORS.accent,borderRadius:12,height:52,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:16,elevation:3},
  saveBtnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  cancelBtn2:{borderRadius:12,height:44,justifyContent:'center',alignItems:'center',marginTop:8,borderWidth:1,borderColor:'#ddd'},
  cancelBtn2Text:{color:'#888',fontWeight:'600'},
});
