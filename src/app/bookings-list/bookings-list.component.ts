import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ParcialService } from '../services/parcial.service';
import { Booking } from '../interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styles: [`
    .badge { text-transform: capitalize; }
  `],
  imports: [CurrencyPipe, ReactiveFormsModule],
  standalone: true
})
export class BookingsListComponent  {

  protected parcialService = inject(ParcialService);

  bookings: Booking[] = [];
  
  venueOptions: any[] = [];

  searchValue = new FormControl('')

  ngOnInit() {
    
    this.getBookings();

    this.searchValue.valueChanges.subscribe(() => {
      this.bookings = this.filterBookings()
    })

    this.parcialService.getVenues().subscribe({
      next: (response) => {
        console.log("venues Options: ", response);
        this.venueOptions = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBookings() {
    /* this.parcialService.getBookings().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    }) */

    this.parcialService.getBookingsJson().subscribe({
      next: (response) => {
        console.log(response);
        this.bookings = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
 
  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'confirmed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  filterBookings() {
    if(!this.searchValue.value) {
      this.getBookings()
    }
    console.log("HOLAHOLA")
    return this.bookings.filter(bk => 
      bk.companyName.toLowerCase().includes(this.searchValue.value?.toLowerCase() ?? '') ||
      bk.bookingCode?.toLowerCase().includes(this.searchValue.value?.toLowerCase() ?? '')
    )
  }

  getVenueName(venueId: string): string {

    let result = "";
    for(const venue of this.venueOptions) {
      if(venue.id === venueId){
        result = venue.name
      }
    }
    return result;
  }
}
