import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function AddStaffScreen({ route, navigation }) {
  const existing = route.params?.staff;
  const isEdit = !!existing;
  const [username, setUsername] = useState(existing?.username || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(existing?.full_name || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [role, setRole] = useState(existing?.role || 'staff');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!username.trim()) return Alert.alert('Required', 'Username is required.');
    if (!isEdit && password.length < 6) return Alert.alert('Required', 'Password must be at least 6 characters.');
    if (!fullName.trim()) return Alert.alert('Required', 'Full name is required.');
    if (!email.includes('@')) return Alert.alert('Required', 'Valid email is required.');
    setLoading(true);
    try {
      const payload = { username: username.trim(), full_name: fullName.trim(), email: email.trim(), role };
      if (password) payload.password = password;
      if (isEdit) { await api.put(`/users/${existing._id}`, payload); Alert.alert('Updated!', '', [{text:'OK',onPress:()=>navigation.goBack()}]); }
      else { await api.post('/users', payload); Alert.alert('Created!', '', [{text:'OK',onPress:()=>navigation.goBack()}]); }
    } catch(e) { Alert.alert('Error', e.response?.data?.message||e.message); }
    finally { setLoading(false); }
  };

  const F = ({label,icon,secureToggle,...p}) => (<View style={{marginBottom:14}}><Text style={{color:'#1a3c5e',fontWeight:'700',fontSize:13,marginBottom:6}}>{label}</Text><View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f9f9f9',borderRadius:10,paddingHorizontal:12,borderWidth:1,borderColor:'#dde6f0'}}><Ionicons name={icon} size={18} color="#888" style={{marginRight:8}}/><TextInput style={{flex:1,height:48,color:'#333',fontSize:14}} placeholderTextColor="#aaa" {...p}/>{secureToggle&&<TouchableOpacity onPress={()=>setShowPwd(!showPwd)} style={{padding:8}}><Ionicons name={showPwd?'eye-off-outline':'eye-outline'} size={18} color="#888"/></TouchableOpacity>}</View></View>);

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <ScrollView style={{flex:1,backgroundColor:'#f0f4f8'}} contentContainerStyle={{padding:16,paddingBottom:40}}>
        <F label="Username *" icon="person-outline" placeholder="username" value={username} onChangeText={setUsername} autoCapitalize="none"/>
        <F label={isEdit?'New Password (blank = keep)':'Password *'} icon="lock-closed-outline" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPwd} secureToggle/>
        <F label="Full Name *" icon="text-outline" placeholder="John Doe" value={fullName} onChangeText={setFullName}/>
        <F label="Email *" icon="mail-outline" placeholder="email@hotel.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        <Text style={{color:'#1a3c5e',fontWeight:'700',fontSize:13,marginBottom:8}}>Role</Text>
        <View style={{flexDirection:'row',gap:10,marginBottom:24}}>
          {['admin','receptionist','staff'].map(r=>(<TouchableOpacity key={r} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:10,backgroundColor:role===r?'#1a3c5e':'#dde6f0'}} onPress={()=>setRole(r)}><Text style={{color:role===r?'#fff':'#555',fontWeight:'600',fontSize:12}}>{r}</Text></TouchableOpacity>))}
        </View>
        <TouchableOpacity style={{backgroundColor:'#e8a045',borderRadius:12,height:54,flexDirection:'row',justifyContent:'center',alignItems:'center',elevation:4}} onPress={save} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<><Ionicons name="save-outline" size={20} color="#fff"/><Text style={{color:'#fff',fontSize:17,fontWeight:'bold'}}> {isEdit?'Update Staff':'Add Staff'}</Text></>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
