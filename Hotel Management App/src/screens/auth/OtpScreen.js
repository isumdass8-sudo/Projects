import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function OtpScreen({ route }) {
  const { userId, demoOTP } = route.params;
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (otp.length !== 6) return Alert.alert('Invalid', 'Enter the 6-digit OTP.');
    setLoading(true);
    try { await verifyOTP(userId, otp); }
    catch (e) { Alert.alert('Failed', e.message || 'Invalid OTP.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#1a3c5e' }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 32 }}>
        <Ionicons name="mail-open-outline" size={72} color="#e8a045" style={{ alignSelf: 'center', marginBottom: 16 }} />
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>Check Your Email</Text>
        <Text style={{ color: '#aac4e0', textAlign: 'center', marginBottom: 24 }}>A 6-digit OTP was sent to your registered email.</Text>
        {demoOTP ? <View style={{ backgroundColor: '#f39c12', borderRadius: 8, padding: 12, marginBottom: 20, alignItems: 'center' }}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OTP: {demoOTP}</Text></View> : null}
        <TextInput style={{ backgroundColor: '#fff', borderRadius: 12, height: 64, fontSize: 32, fontWeight: 'bold', letterSpacing: 12, color: '#1a3c5e', marginBottom: 24, textAlign: 'center' }} value={otp} onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" maxLength={6} placeholder="000000" placeholderTextColor="#aaa" />
        <TouchableOpacity style={{ backgroundColor: '#e8a045', borderRadius: 10, height: 52, justifyContent: 'center', alignItems: 'center' }} onPress={handle} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold' }}>Verify & Login</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
