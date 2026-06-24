import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

const C = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };

export default function StaffListScreen({ navigation }) {
  const [staff, setStaff] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await api.get('/users'); setStaff(data.data || []); }
    catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    let list = staff;
    if (filter !== 'all') list = list.filter(s => s.role === filter);
    if (search) list = list.filter(s => s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.username?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [staff, search, filter]);

  const RC = { admin:{bg:'#fdedec',text:'#e74c3c'}, receptionist:{bg:'#ebf5fb',text:'#3498db'}, staff:{bg:'#eafaf1',text:'#27ae60'} };

  const Card = ({ item }) => {
    const rc = RC[item.role] || RC.staff;
    const initials = item.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    return (
      <View style={s.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={s.avatar}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{initials}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#2c3e50' }}>{item.full_name}</Text>
            <Text style={{ color: '#888', fontSize: 12 }}>@{item.username}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: rc.bg }]}><Text style={[s.badgeT, { color: rc.text }]}>{item.role.toUpperCase()}</Text></View>
        </View>
        <Text style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>📧 {item.email}</Text>
        <Text style={{ color: item.is_active ? '#27ae60' : '#e74c3c', fontSize: 12, marginBottom: 10 }}>{item.is_active ? '✅ Active' : '❌ Inactive'}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[s.btn, { backgroundColor: '#3498db' }]} onPress={() => navigation.navigate('AddStaff', { staff: item })}><Text style={s.btnT}>✏ Edit</Text></TouchableOpacity>
          <TouchableOpacity style={[s.btn, { backgroundColor: item.is_active ? '#f39c12' : '#27ae60' }]} onPress={async () => { try { await api.put(`/users/${item._id}`, { is_active: !item.is_active }); load(); } catch(e) { Alert.alert('Error', e.message); } }}><Text style={s.btnT}>{item.is_active ? 'Deactivate' : 'Activate'}</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.searchBar}><Ionicons name="search-outline" size={18} color="#888" /><TextInput style={{ flex: 1, height: 44, marginLeft: 8, color: '#333' }} placeholder="Search staff..." value={search} onChangeText={setSearch} placeholderTextColor="#aaa" /></View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 4 }}>
        {['all', 'admin', 'receptionist', 'staff'].map(f => (<TouchableOpacity key={f} style={[s.chip, filter===f&&s.chipA]} onPress={()=>setFilter(f)}><Text style={[s.chipT,filter===f&&s.chipTA]}>{f}</Text></TouchableOpacity>))}
      </View>
      <FlatList data={filtered} keyExtractor={i=>i._id} renderItem={({item})=><Card item={item}/>} contentContainerStyle={{padding:12}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} colors={[C.primary]}/>} ListEmptyComponent={<Text style={{textAlign:'center',color:'#aaa',marginTop:48}}>No staff found.</Text>}/>
      <TouchableOpacity style={s.fab} onPress={()=>navigation.navigate('AddStaff',{})}><Ionicons name="add" size={30} color="#fff"/></TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  searchBar:{flexDirection:'row',alignItems:'center',margin:12,backgroundColor:'#fff',borderRadius:10,paddingHorizontal:12,elevation:2},
  card:{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:12,elevation:3},
  avatar:{width:46,height:46,borderRadius:23,backgroundColor:'#1a3c5e',justifyContent:'center',alignItems:'center',marginRight:12},
  badge:{borderRadius:8,paddingHorizontal:8,paddingVertical:4},badgeT:{fontSize:10,fontWeight:'bold'},
  btn:{borderRadius:8,paddingHorizontal:12,paddingVertical:6},btnT:{color:'#fff',fontSize:12,fontWeight:'600'},
  chip:{paddingHorizontal:14,paddingVertical:6,borderRadius:20,backgroundColor:'#dde6f0'},chipA:{backgroundColor:'#1a3c5e'},
  chipT:{color:'#555',fontSize:12,fontWeight:'600'},chipTA:{color:'#fff'},
  fab:{position:'absolute',right:20,bottom:24,width:58,height:58,borderRadius:29,backgroundColor:'#e8a045',justifyContent:'center',alignItems:'center',elevation:6},
});
