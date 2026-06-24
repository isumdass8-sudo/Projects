import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const C = { primary: '#1a3c5e', accent: '#e8a045', bg: '#f0f4f8' };

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, res, b] = await Promise.all([api.get('/rooms'), api.get('/reservations'), api.get('/billing')]);
      const rooms = r.data.data || []; const resv = res.data.data || []; const bills = b.data.data || [];
      setStats({
        totalRooms: rooms.length, available: rooms.filter(x=>x.status==='available').length,
        occupied: rooms.filter(x=>x.status==='occupied').length, maintenance: rooms.filter(x=>x.status==='maintenance').length,
        reservations: resv.length, checkedIn: resv.filter(x=>x.status==='checked_in').length,
        pendingBills: bills.filter(x=>x.payment_status==='pending').length,
        revenue: bills.filter(x=>x.payment_status==='paid').reduce((s,x)=>s+(x.total_amount||0),0),
      });
    } catch(e) { console.log(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const Stat = ({icon,label,value,color,bg}) => (
    <View style={[s.stat,{borderLeftColor:color}]}>
      <View style={[s.statIcon,{backgroundColor:bg}]}><Ionicons name={icon} size={24} color={color}/></View>
      <View style={{flex:1}}><Text style={s.statLabel}>{label}</Text><Text style={[s.statVal,{color}]}>{value}</Text></View>
    </View>
  );

  if (loading) return <View style={s.loader}><ActivityIndicator size="large" color={C.primary}/></View>;
  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} colors={[C.primary]}/>}>
      <View style={s.banner}>
        <View><Text style={{color:'#aac4e0',fontSize:14}}>Welcome back,</Text><Text style={{color:'#fff',fontSize:22,fontWeight:'bold'}}>{user?.full_name||user?.username}</Text><Text style={{color:C.accent,fontSize:12,fontWeight:'700'}}>{(user?.role||'').toUpperCase()}</Text></View>
        <TouchableOpacity onPress={logout} style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,255,255,0.15)',padding:10,borderRadius:8,gap:4}}>
          <Ionicons name="log-out-outline" size={22} color="#fff"/><Text style={{color:'#fff',fontSize:13,fontWeight:'600'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={{padding:16}}>
        <Text style={s.sec}>📊 Quick Overview</Text>
        {stats&&<>
          <Stat icon="bed-outline" label="Total Rooms" value={stats.totalRooms} color="#3498db" bg="#ebf5fb"/>
          <Stat icon="checkmark-circle" label="Available" value={stats.available} color="#27ae60" bg="#eafaf1"/>
          <Stat icon="people" label="Occupied" value={stats.occupied} color="#e74c3c" bg="#fdedec"/>
          <Stat icon="construct-outline" label="Maintenance" value={stats.maintenance} color="#f39c12" bg="#fef9e7"/>
          <Stat icon="calendar-outline" label="Reservations" value={stats.reservations} color="#9b59b6" bg="#f5eef8"/>
          <Stat icon="card-outline" label="Pending Bills" value={stats.pendingBills} color="#e67e22" bg="#fef5e7"/>
          <Stat icon="cash-outline" label="Total Revenue" value={`LKR ${stats.revenue.toLocaleString()}`} color="#16a085" bg="#e8f8f5"/>
        </>}
        <Text style={[s.sec,{marginTop:16}]}>🚀 Quick Actions</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
          {[{icon:'calendar-outline',label:'New Reservation',tab:'Reservations',screen:'CreateReservation'},{icon:'bed-outline',label:'Manage Rooms',tab:'Rooms',screen:'RoomList'},{icon:'card-outline',label:'View Bills',tab:'Billing',screen:'BillingList'},{icon:'construct-outline',label:'Maintenance',tab:'Maintenance',screen:'MaintenanceList'}].map(a=>(
            <TouchableOpacity key={a.label} style={s.action} onPress={()=>navigation.getParent()?.navigate(a.tab,{screen:a.screen})}>
              <Ionicons name={a.icon} size={28} color={C.primary}/><Text style={{color:C.primary,fontSize:12,fontWeight:'600',marginTop:6,textAlign:'center'}}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f0f4f8'}, loader:{flex:1,justifyContent:'center',alignItems:'center'},
  banner:{backgroundColor:'#1a3c5e',padding:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  stat:{backgroundColor:'#fff',borderRadius:12,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',borderLeftWidth:4,elevation:2},
  statIcon:{width:48,height:48,borderRadius:24,justifyContent:'center',alignItems:'center',marginRight:12},
  statLabel:{color:'#888',fontSize:12}, statVal:{fontSize:22,fontWeight:'bold'},
  sec:{fontSize:16,fontWeight:'bold',color:'#1a3c5e',marginVertical:12},
  action:{backgroundColor:'#fff',borderRadius:12,padding:16,alignItems:'center',width:'46%',elevation:2},
});
