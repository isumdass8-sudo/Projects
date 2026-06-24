import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SC = { available:{bg:'#eafaf1',text:'#27ae60'}, occupied:{bg:'#fdedec',text:'#e74c3c'}, maintenance:{bg:'#fef9e7',text:'#f39c12'} };

export default function RoomDetailScreen({ route }) {
  const { room } = route.params;
  const sc = SC[room.status] || SC.available;
  const R = ({icon,label,value}) => (<View style={s.row}><Ionicons name={icon} size={18} color="#1a3c5e" style={{width:26}}/><Text style={s.rl}>{label}</Text><Text style={s.rv}>{value||'—'}</Text></View>);
  return (
    <ScrollView style={{flex:1,backgroundColor:'#f0f4f8'}}>
      <View style={{backgroundColor:'#1a3c5e',padding:24,alignItems:'center'}}>
        <Text style={{color:'#fff',fontSize:28,fontWeight:'bold'}}>Room #{room.room_number}</Text>
        <View style={[{borderRadius:12,paddingHorizontal:14,paddingVertical:5,marginTop:8},{backgroundColor:sc.bg}]}><Text style={{fontWeight:'bold',fontSize:12,color:sc.text}}>{room.status.toUpperCase()}</Text></View>
        <Text style={{color:'#aac4e0',fontSize:16,marginTop:4}}>{room.room_type?.type_name}</Text>
        <Text style={{color:'#e8a045',fontSize:20,fontWeight:'bold',marginTop:8}}>LKR {(room.price_per_night||0).toLocaleString()} / night</Text>
      </View>
      <View style={s.card}><Text style={s.sec}>Room Information</Text>
        <R icon="layers-outline" label="Floor" value={String(room.floor||'—')}/>
        <R icon="people-outline" label="Max Occupancy" value={String(room.room_type?.max_occupancy||'—')}/>
        <R icon="information-circle-outline" label="Description" value={room.room_type?.description}/>
      </View>
      {room.amenities?.length>0&&<View style={s.card}><Text style={s.sec}>Amenities</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{room.amenities.map((a,i)=><View key={i} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#eafaf1',paddingHorizontal:12,paddingVertical:6,borderRadius:20}}><Ionicons name="checkmark-circle" size={14} color="#27ae60"/><Text style={{color:'#27ae60',fontSize:13,fontWeight:'600'}}> {a}</Text></View>)}</View></View>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  card:{backgroundColor:'#fff',margin:12,borderRadius:14,padding:16,elevation:2},
  sec:{fontSize:15,fontWeight:'bold',color:'#1a3c5e',marginBottom:14,borderBottomWidth:1,borderColor:'#eee',paddingBottom:8},
  row:{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderColor:'#f5f5f5'},
  rl:{color:'#888',fontSize:13,flex:1}, rv:{color:'#2c3e50',fontSize:14,fontWeight:'600',flex:2,textAlign:'right'},
});
