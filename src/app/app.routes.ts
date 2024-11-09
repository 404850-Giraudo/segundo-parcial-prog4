import { Routes } from '@angular/router';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';

export const routes: Routes = [
    
    { path: 'create-booking', component: CreateBookingComponent},

    { path: 'bookings', component: BookingsListComponent},
];

