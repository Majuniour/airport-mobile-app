import React from 'react';
import { StyleSheet,View,SafeAreaView,Text, TouchableOpacity, Image, ScrollView,FlatList,ActivityIndicator, AsyncStorage } from 'react-native'
import { ListItem} from 'react-native-elements'
import TimetableData from '../assets/json/JNB.json';
import { AppService } from "../app.service";
import Moment from 'moment';


export default class Timetable extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackground: (
        <Image
          source={require('../assets/images/_android/Img_x2.png')}
          style={{height:200, width:'100%'}}
        />
      ),
     title: `${navigation.state.params.title}`,
     headerSubtitle:`${navigation.state.params.title}`,
     headerTitleStyle: {
      fontWeight: 'bold',
      top: '30%',
      right: 60
    },
     headerLeft: (
      <TouchableOpacity onPress={ async () => {
        navigation.navigate('Home')}}>
  <Text style={{color:'white', marginLeft:10}}>Back</Text>
  </TouchableOpacity>
      ),
    headerStyle: {
      backgroundColor: '#10044c',
    },
    headerTintColor: '#fff',
  };
  };
  appService: AppService = new AppService;

  constructor(props, appService) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  async componentDidMount(){
    this.getSelectedAirportData().then(() => {
      this.setState({
        isLoading:false
      })
    })
  }

  getSelectedAirportData = async () => {
    const airportData = await this.props.navigation.state.params.timeTable;
    this.setState({
      data:airportData
    })
     console.log("TimeTable For view", airportData);
    // return airportData;
  }

  render(){
    //console.log("TimeTable For view", this.state.data);
    if (this.state.isLoading) {
      return (
        <View style={styles.container}> 
        <View style={styles.activityLoader}>
        <ActivityIndicator size="large" color="#9bc235"/>
        </View>
     </View>
      )
    }else{
  return (
      <View style={styles.container}>
  <ScrollView style={{backgroundColor:'#f8f7f7'}}>
            <FlatList
              data={JSON.parse(this.state.data)}
              renderItem={({ item, index }) => (
                <ListItem style={{margin:10}}
                  roundAvatar
                  subtitle={
                    <View style={{flexDirection: 'column'}}>
                      <View style={styles.flightDetails}>
                        <View style={{width:'75%'}}>
                          <Text style={{fontWeight:'bold', color:'#10044c'}}>{Moment(item.departure.scheduledTime).format('LT')}</Text>
                          </View>
                          <View>
                    <Image 
                      source={item.status !== 'active' ? require('../assets/images/_ios/Red_dot_x1.png') : require('../assets/images/_android/green_dot_x1.png')}
                      style={{height:7, width:7, top: 7}}
                    />
                    </View>
                      <View style={{left:5, width:'25%'}}>
                    <Text style={{textTransform: 'capitalize', fontWeight:'bold'}}>{item.status}</Text>
                    </View>
                      </View>
                    <View style={styles.flight}>
                    <View>
                      <Image 
                      source={require('../assets/images/_ios/Plane_x1.png')}
                      style={{height:40, width:40, top:10}}
                    />
                    </View>
                    <View style={{width:'80%'}}> 
                      <Text style={{fontWeight:'bold',fontSize:20}}>{item.airline.name}</Text>
                      <Text style={{fontWeight:'bold'}}>{item.arrival.iataCode}</Text>
                      <Text style={{fontWeight:'bold'}}>{item.flight.number}</Text>
                      
                    </View>
                  </View>
                
                    </View>
               
               
                  }
                  containerStyle={{ borderBottomWidth: 0 }}
                />
              )}
              keyExtractor={(item, index) => 'key'+index}
            />
          </ScrollView>
      </View>

)
}
  }
}
const styles = StyleSheet.create({
  container: {
    marginVertical:100,
    height:'100%'
  },
  flight:{flex: 1, flexDirection: 'row', borderBottomColor:'grey', borderBottomWidth:0, width:'100%'},
  flightDetails:{flexDirection: 'row', alignContent:'space-between', alignSelf:'flex-start',borderBottomColor:'grey', borderBottomWidth:1},
  activityLoader:{
    flex: 1,   
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor:'#ffffff'
  }
})
