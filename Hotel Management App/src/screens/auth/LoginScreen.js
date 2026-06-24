import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const C = { primary: '#1a3c5e', accent: '#e8a045' };

export default function LoginScreen({ navigation }) {
  const { staffLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!username.trim() || !password.trim()) return Alert.alert('Required', 'Enter username and password.');
    setLoading(true);
    try {
      const data = await staffLogin(username.trim(), password);
      navigation.navigate('OTP', { userId: data.userId, demoOTP: data.demoOTP });
    } catch (e) { Alert.alert('Login Failed', e.message || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: C.primary }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Ionicons name="business" size={64} color={C.accent} />
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 12 }}>Hotel Management</Text>
          <Text style={{ color: '#aac4e0', fontSize: 16, marginTop: 4 }}>Staff Portal</Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardTitle}>Staff Login</Text>
          <View style={s.inputRow}>
            <Ionicons name="person-outline" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput style={s.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor="#aaa" />
          </View>
          <View style={s.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput style={[s.input, { flex: 1 }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPwd} placeholderTextColor="#aaa" />
            <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={{ padding: 8 }}>
              <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.btn} onPress={handle} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Login & Get OTP</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => navigation.navigate('ClientLogin')}>
            <Text style={{ color: C.primary, fontSize: 14, fontWeight: '600' }}>Guest / Client Login →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 8 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a3c5e', marginBottom: 20, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 16, backgroundColor: '#f9f9f9', paddingHorizontal: 12 },
  input: { flex: 1, height: 48, color: '#333', fontSize: 15 },
  btn: { backgroundColor: '#e8a045', borderRadius: 10, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
