import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const C = { primary: '#1a3c5e', accent: '#27ae60' };

export default function RegisterScreen({ navigation }) {
  const { clientRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState('passport');
  const [idNumber, setIdNumber] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!username.trim() || username.trim().length < 3) e.username = 'Username required (min 3 chars).';
    if (!password || password.length < 6)               e.password = 'Password required (min 6 chars).';
    if (!fullName.trim())                               e.fullName = 'Full name is required.';
    if (!email.trim() || !email.includes('@'))          e.email    = 'Valid email is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await clientRegister({ username: username.trim(), password, full_name: fullName.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), id_type: idType, id_number: idNumber.trim() });
      Alert.alert('Account Created! 🎉', 'You can now login.', [{ text: 'Login Now', onPress: () => navigation.navigate('ClientLogin') }]);
    } catch (e) {
      Alert.alert('Failed', e.response?.data?.message || e.message || 'Please try again.');
    } finally { setLoading(false); }
  };

  const F = ({ label, icon, err, secureToggle, ...p }) => (
    <View style={{ marginBottom: 4 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.row, err && s.rowErr]}>
        <Ionicons name={icon} size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput style={{ flex: 1, height: 48, color: '#333', fontSize: 14 }} placeholderTextColor="#aaa" {...p} />
        {secureToggle && <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={{ padding: 8 }}><Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color="#888" /></TouchableOpacity>}
      </View>
      {err ? <Text style={s.err}>⚠ {err}</Text> : <View style={{ height: 8 }} />}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.primary }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Ionicons name="person-add-outline" size={56} color={C.accent} />
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Create Account</Text>
          <Text style={{ color: '#aac4e0', fontSize: 13, marginTop: 4 }}>Fields marked * are required</Text>
        </View>
        <View style={s.card}>
          <F label="Username *"       icon="person-outline"      placeholder="Min 3 characters"  value={username}  onChangeText={t=>{setUsername(t);  setErrors(e=>({...e,username:null}));}}  autoCapitalize="none"    err={errors.username} />
          <F label="Password *"       icon="lock-closed-outline" placeholder="Min 6 characters"  value={password}  onChangeText={t=>{setPassword(t);  setErrors(e=>({...e,password:null}));}}  secureTextEntry={!showPwd} secureToggle err={errors.password} />
          <F label="Full Name *"      icon="text-outline"        placeholder="Your full name"     value={fullName}  onChangeText={t=>{setFullName(t);  setErrors(e=>({...e,fullName:null}));}}  err={errors.fullName} />
          <F label="Email *"          icon="mail-outline"        placeholder="your@email.com"     value={email}     onChangeText={t=>{setEmail(t);     setErrors(e=>({...e,email:null}));}}     keyboardType="email-address" autoCapitalize="none" err={errors.email} />
          <F label="Phone (optional)" icon="call-outline"        placeholder="07X XXX XXXX"       value={phone}     onChangeText={setPhone} keyboardType="phone-pad" />
          <F label="ID Number (opt.)" icon="card-outline"        placeholder="Passport / NIC No." value={idNumber}  onChangeText={setIdNumber} />
          <Text style={s.label}>ID Type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {[{v:'passport',l:'🛂 Passport'},{v:'id_card',l:'🪪 NIC'},{v:'driving_license',l:'🚗 Driving Lic.'}].map(o=>(
              <Pressable key={o.v} style={[s.chip, idType===o.v&&s.chipA]} onPress={()=>setIdType(o.v)}>
                <Text style={[s.chipT, idType===o.v&&s.chipTA]}>{o.l}</Text>
              </Pressable>
            ))}
          </View>
          <TouchableOpacity style={s.btn} onPress={handle} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="checkmark-circle-outline" size={20} color="#fff" /><Text style={s.btnT}>  Create Account</Text></>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => navigation.navigate('ClientLogin')}>
            <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600' }}>Already have an account? Login →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 6 },
  label: { color: '#1a3c5e', fontWeight: '700', fontSize: 12, marginBottom: 5, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dde6f0', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#f9f9f9' },
  rowErr: { borderColor: '#e74c3c', borderWidth: 1.5 },
  err: { color: '#e74c3c', fontSize: 11, marginTop: 3 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f4f8', borderWidth: 1, borderColor: '#dde6f0' },
  chipA: { backgroundColor: '#1a3c5e', borderColor: '#1a3c5e' },
  chipT: { color: '#555', fontSize: 12, fontWeight: '600' },
  chipTA: { color: '#fff' },
  btn: { backgroundColor: '#27ae60', borderRadius: 12, height: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3, marginTop: 8 },
  btnT: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
