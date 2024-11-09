import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ParcialService } from "../services/parcial.service";


export function isAvailable(parcialService: ParcialService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

        /* if (!control.parent) {
            return of(null);
        } */

        const venueId = control.get('venueId')?.value;
        const venueDate = control.get('eventDate')?.value;

        if(!venueId || !venueDate) {
            return of(null)
        }

        console.log("id: ", venueId)
        console.log("date: ", venueDate)


        return parcialService.getAvailability().pipe(
            tap((resp) => {
                console.log(resp);
                
            }),
            map(resp => {

                for(const r of resp) {
                    if(r.venueId === venueId && r.date === venueDate) {
                        if(!r.available) {
                            console.log("entrasteeeeee")
                            return { notAvailable: true}
                        }
                    }
                }
                console.log("se puedeeeeeeee")
                return null;
            }),
            catchError((error) => {
                console.error("error al validar limite de pedidos: ", error)
                return of(null)
            })
        )
      
    };
  }