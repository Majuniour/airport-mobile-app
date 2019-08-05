import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Dimensions, Platform, Text, ActivityIndicator, AsyncStorage, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
RADIUS = 500;
//App Service
import { AppService } from "../app.service";

export default class HomeScreen extends Component {
  appService: AppService = new AppService;
  constructor(props, appService) {
    super();
    this.state = {
      locationResult: null,
      location: {coords: { latitude: -26.134789, longitude: 28.240528, latitudeDelta: 0.0922,longitudeDelta: 0.0421}},
      isLoading: true
    };
  }

   async componentDidMount() {
    this._getLocationAsync();
    const nearByAirPorts = await this.appService.getNearByAirports();
    if(nearByAirPorts !== null){
      console.log("NearBy Airports", nearByAirPorts)
      this.setState({
        nearByAirPortsLocations:nearByAirPorts,
        isLoading:false,
      })
      
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log("Location", location.coords);
    if(location !== null){
    this.setState({ 
      locationResult: JSON.stringify(location), 
      location,
      cLat: parseFloat(JSON.stringify(location.coords.latitude)),
      clong: parseFloat(JSON.stringify(location.coords.longitude)),
    });  
  }
  }




  render() {
    //const currentLocation =  JSON.parse(this.state.locationResult);
    const actualLocation = {
      latitude: this.state.cLat,
      longitude: this.state.clong,
      latitudeDelta:  0.5,
      longitudeDelta: 0.5 * (screenWidth / screenHeight),
    };
  console.log("this.state.cLat", this.state.cLat);
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
      <View style={{flex:1}}>
      <MapView
      style={{ alignSelf: 'stretch', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      initialRegion={{latitude: this.state.cLat, "longitude":this.state.clong, "latitudeDelta":actualLocation.latitudeDelta, "longitudeDelta":actualLocation.longitudeDelta}}
      showsUserLocation={true}
      showCompass={true} 
      rotateEnabled={false}
      followsUserLocation={true}
      >
      { this.state.nearByAirPortsLocations.map((marker, index) => {
     const coords = {
         "longitude": parseFloat(marker.longitudeAirport),
         "latitude": parseFloat(marker.latitudeAirport)
     };
     console.log("coord", coords)
     const metadata = `Status`;
    //  <MapView.Circle
    //  center={{latitude: -29.1471337,
    //   longitude: -51.148951}}
    //   radius={1000} 
    //   strokeColor={'rgba(100,100,100,.5)'} fillColor={'rgba(100,100,100,.5)'} 
    //   />
     return (
         <MapView.Marker
            key={index}
            coordinate={coords}
            image={Platform.OS === 'android' ?  require('../assets/images/_android/Pin.svg') : require('../assets/images/_ios/Pin_x2.png')}
            title={marker.nameAirport}
            description={marker.nameCountry}
            onPress={ async () => {
              this.setState({
                isLoading:true,
              })
              console.log("Selected Airport", marker.codeIataCity)
                await this.appService.flightTimeTable(`${marker.codeIataCity}`).then((res) => {
                  if(res){
                    this.setState({
                      isLoading:false
                    })
                    let timeTable = {
                      timetable: res
                    }
                   
                    if(timeTable.timetable.error){
                      console.log("No Data", timeTable.timetable.error)
                      // this.props.navigation.navigate('Timetable',{title:`${marker.nameAirport}`, timeTable:``});
                      Alert.alert(
                        'SORRY',
                        `${timeTable.timetable.error}`,
                        [{
                            text: 'OK',
                            onPress: () => {
                                }
        
                            }
                         ], {
                            cancelable: false
                        }
                    ) 
                    }else{
                      console.log("success", timeTable)
                      this.props.navigation.navigate('Timetable',{title:`${marker.nameAirport}`, timeTable:`${JSON.stringify(timeTable.timetable)}`}); 
                    }
                  
                  }
                })
        
           }
          }
         />
     );
  })}

</MapView>
         
</View>
    );
  }
}
}
HomeScreen.navigationOptions = {
  title: 'Mobile Airport Application',
  headerStyle: {
    backgroundColor: '#10044c',
  },
  headerTintColor: '#fff',
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  activityLoader:{
    flex: 1,   
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor:'#ffffff'
  }
});