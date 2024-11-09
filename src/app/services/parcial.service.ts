import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venue, Service, Booking } from '../interfaces';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ParcialService {

  constructor(private http: HttpClient) { }


  getVenues(): Observable<Venue[]> {

    // return this.http.get<Venue[]>(environment.apiVenues); 
    return this.http.get<Venue[]>("http://localhost:3000/venues");
  }




  // metodo para obtener el venue por id
  getVenue(id: string): Observable<Venue> {

    console.log("LLamada a la api ", id)
    
    return this.http.get<Venue>("http://localhost:3000/venues/" + id);
    //return this.http.get<Venue>(environment.apiVenues + "/" + id);
  }




  getServices(): Observable<Service[]> {

    // return this.http.get<Service[]>(environment.apiServices)
    return this.http.get<Service[]>("http://localhost:3000/services")
  }




  getAvailability(): Observable<any[]> {

    // return this.http.get<any[]>(environment.apiAvailability)
    return this.http.get<any[]>("http://localhost:3000/availability")
  }




  postBooking(booking: Booking): Observable<Booking> {

    // return this.http.post<Booking>(environment.apiBookings, booking)
    return this.http.post<Booking>("http://localhost:3000/bookings", booking)
  }
  

  getBookings(): Observable<Booking[]> {

    return this.http.get<Booking[]>(environment.apiBookings)
  }


  // armo un getBookings con el mock del db.json para probar unicamente porque hay muchos registros
  getBookingsJson(): Observable<Booking[]> {

    return this.http.get<Booking[]>("http://localhost:3000/bookings")
  }

}
