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

  // inyecto el servicio
  protected parcialService = inject(ParcialService);

  // lista de bookings para mostrar en la tabla del html
  bookings: Booking[] = [];
  
  // valores de venue para poder mapear el nombre a partir del codigo que trae el bookings
  venueOptions: any[] = [];

  // form control simple para realizar las busquedas -> en el html lo asocio con el [formControl]="searchValue" al input
  searchValue = new FormControl('')

  ngOnInit() {
    // llamo al metodo para obtener los bookings para mostrar
    this.getBookings();

    // me suscribo a los cambios que puede tener el input para filtrar
    this.searchValue.valueChanges.subscribe(() => {
      // asigno la lista filtrada a la lista que se muestra en el html
      this.bookings = this.filterBookings()
    })

    // obtengo las venues para mapear el nombre (esto se podría separar en una función y llamarla aca como el getBookings())
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

  // filtro del buscador
  filterBookings() {

    // si no tiene valores devuelvo la lista completa
    if(!this.searchValue.value) {
      this.getBookings()
    }
    console.log("HOLAHOLA")
    // filtro a partir de lo que hay en el searchValue defiinido arriba (que es el input del html)
    // por los campos que pidieron -> companyName o bookingCode
    return this.bookings.filter(bk => 
      bk.companyName.toLowerCase().includes(this.searchValue.value?.toLowerCase() ?? '') ||
      bk.bookingCode?.toLowerCase().includes(this.searchValue.value?.toLowerCase() ?? '')
    )
  }

  // mapeo los nombres de venue a partir del id
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
