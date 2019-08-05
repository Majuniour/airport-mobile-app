import * as base from './Config';
export class AppService {
    //Apis
    env = base.api;
    constructor(props) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }


    async getNearByAirports() {
       try{
           const restPath = await fetch(`${this.env.nearby_airports}${this.env.API_KEY}&lat=-26.134789&lng=28.0473&distance=100`, {
               method:'GET',
               headers: new Headers({
                   'Content-Type': 'application/json'
               })
           })
           
           const gotNearByAirport = await restPath.json();
           if(gotNearByAirport !== null){
               return gotNearByAirport;
           }
       }
       catch (error){
           console.log(error)
       }
   }
   async flightTimeTable(iataCode) {
    console.log("Selected Code", iataCode)
    try{
        const restPath = await fetch(`${this.env.flight_timetable}${this.env.API_KEY}&iataCode=${iataCode}&type=departure`, {
            method:'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        
        const airportFlightTimeTable = await restPath.json();
        if(airportFlightTimeTable !== null){
            return airportFlightTimeTable;
        }else{
            return null
        }
    }
    catch (error){
        console.log(error)
    }
}


} 
