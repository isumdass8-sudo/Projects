import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

const C = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };

export default function AddRoomScreen({ route, navigation }) {
  const existing = route.params?.room;
  const isEdit = !!existing;
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomNumber, setRoomNumber] = useState(existing?.room_number || '');
  const [roomType, setRoomType] = useState(existing?.room_type?._id || '');
  const [price, setPrice] = useState(existing?.price_per_night?.toString() || '');
  const [floor, setFloor] = useState(existing?.floor?.toString() || '');
  const [amenities, setAmenities] = useState(existing?.amenities?.join(', ') || '');
  const [status, setStatus] = useState(existing?.status || 'available');
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/rooms/types').then(({data}) => { setRoomTypes(data.data||[]); if(!isEdit&&data.data?.length) setRoomType(data.data[0]._id); }).catch(()=>{}); }, []);

  const save = async () => {
    if (!roomNumber.trim()) return Alert.alert('Required', 'Room number is required.');
    if (!price || isNaN(price)) return Alert.alert('Required', 'Valid price is required.');
    setLoading(true);
    try {
      const payload = { room_number: roomNumber.trim(), room_type: roomType, price_per_night: parseFloat(price), floor: floor ? parseInt(floor) : undefined, amenities: amenities ? amenities.split(',').map(a=>a.trim()).filter(Boolean) : [], status };
      if (isEdit) { await api.put(`/rooms/${existing._id}`, payload); Alert.alert('Updated!', '', [{text:'OK',onPress:()=>navigation.goBack()}]); }
      else { await api.post('/rooms', payload); Alert.alert('Created!', '', [{text:'OK',onPress:()=>navigation.goBack()}]); }
    } catch(e) { Alert.alert('Error', e.response?.data?.message||e.message); }
    finally { setLoading(false); }
  };

  const F = ({label,icon,...p}) => (<View style={{marginBottom:16}}><Text style={{color:C.primary,fontWeight:'700',fontSize:13,marginBottom:6}}>{label}</Text><View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:10,paddingHorizontal:14,borderWidth:1,borderColor:'#dde6f0'}}><Ionicons name={icon} size={18} color="#888" style={{marginRight:8}}/><TextInput style={{flex:1,height:48,color:'#333',fontSize:14}} placeholderTextColor="#aaa" {...p}/></View></View>);

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16,paddingBottom:40}}>
        <F label="Room Number *" icon="keypad-outline" placeholder="e.g. 101" value={roomNumber} onChangeText={setRoomNumber}/>
        <F label="Price Per Night *" icon="cash-outline" placeholder="e.g. 5000" value={price} onChangeText={setPrice} keyboardType="numeric"/>
        <F label="Floor" icon="layers-outline" placeholder="e.g. 2" value={floor} onChangeText={setFloor} keyboardType="numeric"/>
        <F label="Amenities (comma-separated)" icon="star-outline" placeholder="WiFi, AC, TV" value={amenities} onChangeText={setAmenities}/>
        <Text style={{color:C.primary,fontWeight:'700',fontSize:13,marginBottom:8}}>Room Type</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20}}>
          {roomTypes.map(t=>(<TouchableOpacity key={t._id} style={{paddingHorizontal:16,paddingVertical:8,borderRadius:20,backgroundColor:roomType===t._id?C.primary:'#dde6f0'}} onPress={()=>setRoomType(t._id)}><Text style={{color:roomType===t._id?'#fff':'#555',fontWeight:'600',fontSize:13}}>{t.type_name}</Text></TouchableOpacity>))}
        </View>
        <Text style={{color:C.primary,fontWeight:'700',fontSize:13,marginBottom:8}}>Status</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:24}}>
          {['available','occupied','maintenance'].map(st=>(<TouchableOpacity key={st} style={{paddingHorizontal:16,paddingVertical:8,borderRadius:20,backgroundColor:status===st?C.primary:'#dde6f0'}} onPress={()=>setStatus(st)}><Text style={{color:status===st?'#fff':'#555',fontWeight:'600',fontSize:13}}>{st}</Text></TouchableOpacity>))}
        </View>
        <TouchableOpacity style={{backgroundColor:C.accent,borderRadius:12,height:54,flexDirection:'row',justifyContent:'center',alignItems:'center',elevation:4}} onPress={save} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<><Ionicons name="save-outline" size={20} color="#fff"/><Text style={{color:'#fff',fontSize:17,fontWeight:'bold'}}> {isEdit?'Update Room':'Create Room'}</Text></>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
