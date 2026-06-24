import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ClientLoginScreen({ navigation }) {
  const { clientLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!username.trim() || !password.trim()) return Alert.alert('Required', 'Enter username and password.');
    setLoading(true);
    try { await clientLogin(username.trim(), password); }
    catch (e) { Alert.alert('Login Failed', e.message || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#1a3c5e' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <Ionicons name="person-circle-outline" size={72} color="#27ae60" />
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 8 }}>Guest Portal</Text>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a3c5e', marginBottom: 20, textAlign: 'center' }}>Guest Login</Text>
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
          <TouchableOpacity style={[s.btn, { backgroundColor: '#27ae60' }]} onPress={handle} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Login</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#1a3c5e', fontSize: 14, fontWeight: '600' }}>Don't have an account? Register →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 8, alignItems: 'center' }} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#888', fontSize: 13 }}>← Staff Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 16, backgroundColor: '#f9f9f9', paddingHorizontal: 12 },
  input: { flex: 1, height: 48, color: '#333', fontSize: 15 },
  btn: { backgroundColor: '#e8a045', borderRadius: 10, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
