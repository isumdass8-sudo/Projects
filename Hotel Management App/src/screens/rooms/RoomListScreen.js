import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const C = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };
const SC = { available:{bg:'#eafaf1',text:'#27ae60'}, occupied:{bg:'#fdedec',text:'#e74c3c'}, maintenance:{bg:'#fef9e7',text:'#f39c12'} };

export default function RoomListScreen({ navigation }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isAdmin = user?.role === 'admin' || user?.role === 'receptionist';

  const load = useCallback(async () => {
    try { const { data } = await api.get('/rooms'); setRooms(data.data || []); }
    catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    let list = rooms;
    if (filter !== 'all') list = list.filter(r => r.status === filter);
    if (search) list = list.filter(r => r.room_number.toLowerCase().includes(search.toLowerCase()) || r.room_type?.type_name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [rooms, search, filter]);

  const del = (id) => Alert.alert('Delete', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await api.delete(`/rooms/${id}`); load(); } catch (e) { Alert.alert('Error', e.message); } } }]);

  const Card = ({ item }) => {
    const sc = SC[item.status] || SC.available;
    return (
      <TouchableOpacity style={s.card} onPress={() => navigation.navigate('RoomDetail', { room: item })}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>#{item.room_number}</Text></View>
          <View style={[s.badge, { backgroundColor: sc.bg }]}><Text style={[s.badgeT, { color: sc.text }]}>{item.status.toUpperCase()}</Text></View>
        </View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#2c3e50', marginBottom: 6 }}>{item.room_type?.type_name || 'N/A'}</Text>
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Floor: {item.floor || '—'}  |  Max: {item.room_type?.max_occupancy || '—'}</Text>
        <Text style={{ color: '#27ae60', fontSize: 14, fontWeight: '700' }}>LKR {(item.price_per_night || 0).toLocaleString()} / night</Text>
        {isAdmin && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <TouchableOpacity style={[s.btn, { backgroundColor: '#3498db' }]} onPress={() => navigation.navigate('AddRoom', { room: item })}>
              <Text style={s.btnT}>✏ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, { backgroundColor: '#e74c3c' }]} onPress={() => del(item._id)}>
              <Text style={s.btnT}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.searchBar}><Ionicons name="search-outline" size={18} color="#888" /><TextInput style={{ flex: 1, height: 44, marginLeft: 8, color: '#333' }} placeholder="Search room or type..." value={search} onChangeText={setSearch} placeholderTextColor="#aaa" /></View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 4 }}>
        {['all', 'available', 'occupied', 'maintenance'].map(f => (
          <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipA]} onPress={() => setFilter(f)}>
            <Text style={[s.chipT, filter === f && s.chipTA]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={i => i._id} renderItem={({ item }) => <Card item={item} />} contentContainerStyle={{ padding: 12 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[C.primary]} />} ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 48 }}>No rooms found.</Text>} />
      {isAdmin && <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AddRoom', {})}><Ionicons name="add" size={30} color="#fff" /></TouchableOpacity>}
    </View>
  );
}

const s = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, elevation: 2 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 3 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }, badgeT: { fontSize: 11, fontWeight: 'bold' },
  btn: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 }, btnT: { color: '#fff', fontWeight: '600', fontSize: 13 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#dde6f0' }, chipA: { backgroundColor: '#1a3c5e' },
  chipT: { color: '#555', fontSize: 12, fontWeight: '600' }, chipTA: { color: '#fff' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: '#e8a045', justifyContent: 'center', alignItems: 'center', elevation: 6 },
});
