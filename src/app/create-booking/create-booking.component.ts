import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParcialService } from '../services/parcial.service';
import { isAvailable } from '../utils/availableValidator';
import { Booking } from '../interfaces';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent {

  protected parcialService = inject(ParcialService);

  serviceOptions: any[] = [];
  venueOptions: any[] = [];

  venueTotal = 0;
  selectedVenue: any;

  subtotals: any[] = [];

  total: number = 0;
  discount: number = 0;

  bookingForm: FormGroup = new FormGroup({

    // Datos de la empresa
    companyName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    companyEmail: new FormControl('', [Validators.required, Validators.email]),
    contactPhone: new FormControl('', [Validators.required]),

    // Datos del evento
    venueId: new FormControl('', [Validators.required]),
    eventDate: new FormControl(new Date(), [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    totalPeople: new FormControl('', [Validators.required]),

    // form array de servicios
    services: new FormArray([])

  }, [], [ isAvailable(this.parcialService) ]) 

  // ver que el validador asincrono se llama una vez que los validadores sincronos son correctos
  // -----------------------------------------------------------------------------------------

  get services() {
    return this.bookingForm.controls['services'] as FormArray;
  }

  add() {
    const serviceForm = new FormGroup({
      serviceId: new FormControl(''),
      quantity: new FormControl('', [Validators.required, Validators.min(10)]),
      startTime: new FormControl(''),  // validar que el startTime sea menor que el endTime
      endTime: new FormControl(''),
    })

    this.services.push(serviceForm);
  }

  remove(index: number) {
    this.services.removeAt(index)
  }



  // ------------------- onInit --------------------
  ngOnInit() {

    this.parcialService.getServices().subscribe({
      next: (response) => {
        console.log("services Options: ", response);
        this.serviceOptions = response;
      },
      error: (error) => {
        console.error(error);
      }
    });

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

  sendForm() {
    // console.log(this.bookingForm.value);

    if(this.bookingForm.valid) {
      console.log("form valido");
      console.log(this.createBooking());

      const booking = this.createBooking();

      this.parcialService.postBooking(booking).subscribe({
        next: (response) => {
          console.log("Post hecho: ", response);
          
        },
        error: (error) => {
          console.error(error);
          
        }
      })

    } else {
      console.log("form no valido");
      
    }

  }

  



  // ------------------------------- metodos ----------------


  // metodo para crear el booking para el POST
  createBooking(): Booking {

    const bookingServices = [];

    let subTotal = 0;

    for(const serv of this.services.controls) {

      bookingServices.push({

          serviceId: serv.get('serviceId')?.value,
          quantity: serv.get('quantity')?.value,
          pricePerPerson: serv.get('pricePerPerson')?.value,
          startTime: serv.get('startTime')?.value,
          endTime: serv.get('endTime')?.value

      })

      // subTotal += parseInt(serv.get('pricePerPerson')?.value) * parseInt(serv.get('quantity')?.value);
      
    }

    this.calculateTotal();

    let code = "";
    for(let i = 0; i < 6; i++) {
      code += (Math.floor(1 + Math.random() * 9)).toString();
    }
    console.log("CODIGO", code)
    
    const booking : Booking = {
      bookingCode: code,
      companyName: this.bookingForm.controls['companyName'].value,
      companyEmail: this.bookingForm.controls['companyEmail'].value,
      contactPhone: this.bookingForm.controls['contactPhone'].value,
      venueId: this.bookingForm.controls['venueId'].value,
      eventDate: this.bookingForm.controls['eventDate'].value,
      startTime: this.bookingForm.controls['startTime'].value,
      endTime: this.bookingForm.controls['endTime'].value,
      totalPeople: this.bookingForm.controls['totalPeople'].value,

      services: bookingServices,
      
      totalAmount: this.total,
      status: "confirmed"
    }

    return booking;

  }



  // metodo para tomar el servicio selecciondo
  selectVenue(event: any) {
    console.log(event.target.value);
    const venueId = event.target.value;
    console.log(venueId);

    const venue = this.venueOptions.find(venue => venue.id === venueId);
    console.log(venue);
    this.selectedVenue = venue;

    this.bookingForm.controls['totalPeople'].addValidators(Validators.max(venue.capacity))
    
    this.venueTotal = venue.pricePerHour * this.bookingForm.controls['totalPeople'].value;

  }




  // metodo para calcular subtotal del servicio
  calculateSubTotal(index: number) {
    const servId = this.services.at(index).get('serviceId')?.value;

    const serv = this.serviceOptions.find(serv => serv.id === servId);
    console.log(serv);

    if(serv) {
      this.subtotals[index] = serv.pricePerPerson * this.services.at(index).get('quantity')?.value
      console.log("subtotal" , this.subtotals[index])
    }
    this.calculateTotal();
  }


  // metodo para calcular el total del Venue  
  // calculo el de precio por hora por la cantidad de personas como dijo el profe
  calculateVenueTotal() {
    console.log(this.selectedVenue.pricePerHour)
    console.log(this.bookingForm.controls['totalPeople'].value)

    this.venueTotal = this.selectedVenue.pricePerHour * this.bookingForm.controls['totalPeople'].value;

    this.calculateTotal();
  }

  // metodo para calcular el total total
  calculateTotal() {
    let subTotal = 0;
    for (const subt of this.subtotals) {
      subTotal += subt
    }

    if(this.bookingForm.controls['totalPeople'].value > 100 ) {

      this.discount = (subTotal + this.venueTotal) * 0.15
      this.total = (subTotal + this.venueTotal) * 0.85
    } else {
      this.discount = 0;
      this.total = subTotal + this.venueTotal;
    }
  }
}