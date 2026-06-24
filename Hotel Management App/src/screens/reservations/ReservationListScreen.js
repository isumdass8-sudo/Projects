import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const C = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };
const SC = { reserved:{bg:'#ebf5fb',text:'#3498db'}, checked_in:{bg:'#eafaf1',text:'#27ae60'}, checked_out:{bg:'#f5eef8',text:'#9b59b6'}, cancelled:{bg:'#fdedec',text:'#e74c3c'} };

export default function ReservationListScreen({ navigation }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isClient = user?.role === 'client';

  const load = useCallback(async () => {
    try { const { data } = await api.get('/reservations'); setReservations(data.data || []); }
    catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    let list = reservations;
    if (filter !== 'all') list = list.filter(r => r.status === filter);
    if (search) list = list.filter(r => r.guest_name?.toLowerCase().includes(search.toLowerCase()) || r.room?.room_number?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [reservations, search, filter]);

  const action = async (id, endpoint) => {
    try { await api.put(`/reservations/${id}/${endpoint}`); load(); }
    catch (e) { Alert.alert('Error', e.message); }
  };

  const Card = ({ item }) => {
    const sc = SC[item.status] || SC.reserved;
    const nights = item.check_in_date && item.check_out_date ? Math.ceil((new Date(item.check_out_date) - new Date(item.check_in_date)) / 86400000) : 0;
    return (
      <TouchableOpacity style={s.card} onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2c3e50', flex: 1 }}>{item.guest_name}</Text>
          <View style={[s.badge, { backgroundColor: sc.bg }]}><Text style={[s.badgeT, { color: sc.text }]}>{item.status.replace('_', ' ').toUpperCase()}</Text></View>
        </View>
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>🛏 Room {item.room?.room_number || '—'} · {nights} night{nights !== 1 ? 's' : ''}</Text>
        <Text style={{ color: '#888', fontSize: 13 }}>📅 {new Date(item.check_in_date).toDateString()} → {new Date(item.check_out_date).toDateString()}</Text>
        {!isClient && (item.status === 'reserved' || item.status === 'checked_in') && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {item.status === 'reserved' && <TouchableOpacity style={[s.btn, { backgroundColor: '#27ae60' }]} onPress={() => action(item._id, 'checkin')}><Text style={s.btnT}>Check In</Text></TouchableOpacity>}
            {item.status === 'checked_in' && <TouchableOpacity style={[s.btn, { backgroundColor: '#9b59b6' }]} onPress={() => action(item._id, 'checkout')}><Text style={s.btnT}>Check Out</Text></TouchableOpacity>}
            <TouchableOpacity style={[s.btn, { backgroundColor: '#e74c3c' }]} onPress={() => Alert.alert('Cancel', 'Sure?', [{text:'No',style:'cancel'},{text:'Yes',onPress:()=>action(item._id,'cancel')}])}><Text style={s.btnT}>Cancel</Text></TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.searchBar}><Ionicons name="search-outline" size={18} color="#888" /><TextInput style={{ flex: 1, height: 44, marginLeft: 8, color: '#333' }} placeholder="Search guest or room..." value={search} onChangeText={setSearch} placeholderTextColor="#aaa" /></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 6, marginBottom: 4 }}>
        {['all', 'reserved', 'checked_in', 'checked_out', 'cancelled'].map(f => (
          <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipA]} onPress={() => setFilter(f)}>
            <Text style={[s.chipT, filter === f && s.chipTA]}>{f.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={i => i._id} renderItem={({ item }) => <Card item={item} />} contentContainerStyle={{ padding: 12 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[C.primary]} />} ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 48 }}>No reservations found.</Text>} />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CreateReservation')}><Ionicons name="add" size={30} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, elevation: 2 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 3 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }, badgeT: { fontSize: 10, fontWeight: 'bold' },
  btn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 }, btnT: { color: '#fff', fontWeight: '600', fontSize: 13 },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: '#dde6f0' }, chipA: { backgroundColor: '#1a3c5e' },
  chipT: { color: '#555', fontSize: 11, fontWeight: '600' }, chipTA: { color: '#fff' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: '#e8a045', justifyContent: 'center', alignItems: 'center', elevation: 6 },
});
