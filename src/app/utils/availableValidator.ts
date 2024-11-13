import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ParcialService } from "../services/parcial.service";


export function isAvailable(parcialService: ParcialService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {


        // esto debería descomentarse en caso de que se use el validador dentro de un formControl que tiene parents
        // en este caso como lo aplico a todo el form no lo utilizo

        /* if (!control.parent) {
            return of(null);
        } */

        // valores que vienen a partir del control: AbstractControl
        const venueId = control.get('venueId')?.value;
        const venueDate = control.get('eventDate')?.value;

        // si algun dato no esta todavía no valido anda, devuelvo null
        if(!venueId || !venueDate) {
            return of(null)
        }

        console.log("id: ", venueId)
        console.log("date: ", venueDate)


        // llamo al metodo del servicio
        return parcialService.getAvailability().pipe(
            tap((resp) => {
                console.log(resp);
                
            }),
            map(resp => {

                for(const r of resp) {
                    if(r.venueId === venueId && r.date === venueDate) {
                        if(!r.available) {
                            console.log("entrasteeeeee")
                            // se cumple que la fecha y el lugar no estan disponibles, devuelvo un objeto con el error en true
                            return { notAvailable: true}
                        }
                    }
                }
                console.log("se puedeeeeeeee")
                return null;
            }),
            catchError((error) => {
                console.error("error al validar limite de pedidos: ", error)
                // capturo un error en el servidor
                return of(null)
            })
        )
      
    };
  }