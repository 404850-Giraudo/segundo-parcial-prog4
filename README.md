# Sistema de Gestión de Reservas de Eventos Corporativos

## Objetivo

Desarrollar una aplicación web en Angular 18 para gestionar reservas de eventos corporativos, implementando routing, reactive forms con validaciones, y comunicación con API REST.

## Requerimientos Técnicos

1. Angular CLI 18.x
2. Bootstrap 5.x
3. MockAPI

## Estructura del Proyecto

### 1. Routing (5 Puntos)

- Implementar dos rutas principales:
  - `/create-booking`: Formulario de creación de reservas
  - `/bookings`: Lista de reservas realizadas
- Implementar navegación entre pantallas

### 2. Formulario Reactivo (50 puntos)

#### 2.1 Estructura Base(30 puntos)

- Crear un FormGroup con:
  - Datos de la empresa:
    - Nombre de empresa (requerido, mínimo 5 caracteres)
    - Email (requerido, formato email valido)
    - Teléfono de contacto (requerido)
  - Datos del evento:
    - Lugar del evento (requerido, Select desde la API)
    - Fecha (requerido)
    - Hora de inicio (requerido)
    - Hora de finalización (requerido)
    - Cantidad de personas (requerido)
  - FormArray de servicios adicionales:
    - Tipo de servicio (select desde la API)
    - Cantidad de personas (número, mayor a 10)
    - Horario (rango de horas válido)
    - Precio (calculado automáticamente según servicio y cantidad)

#### 2.2 Validaciones(20 puntos)
- Validador asincrónico de disponibilidad:
  - Verificar disponibilidad mediante endpoint GET /availability

### 3. Listado de Reservas(20)
- Tabla responsive con Bootstrap que muestre:
  - Código de reserva
  - Nombre de empresa
  - Lugar del evento
  - Fecha y hora
  - Cantidad de personas
  - Total de la reserva
  - Estado (pendiente/confirmada/cancelada)
- Búsqueda por nombre de empresa o código

### 4. Algoritmo de Procesamiento(25)
- Cálculo del total incluyendo servicios
- Descuento del 15% para eventos > 100 personas
- Generar un código único para el campo bookingCode con un random de 6 numeros.

## Documentación de la API

### 1. Endpoint de Lugares (Venues)
**URL**: `https://671fe0b3e7a5792f052fd920.mockapi.io/venues`
**Descripción**: Obtiene los lugares disponibles para eventos.

#### Formato de Respuesta:
```json
[
  {
    "id": "v1",
    "name": "Centro de Convenciones Aurora",
    "capacity": 500,
    "pricePerHour": 350,
    "amenities": [
      "Estacionamiento gratuito",
      "WiFi de alta velocidad",
      "Sistema de audio",
      "Proyectores HD",
      "Cocina industrial"
    ],
    "address": "Av. Principal 123, Ciudad Empresarial"
  }
]
```

#### Campos de Respuesta:
- `id`: Identificador único del lugar
- `name`: Nombre del lugar
- `capacity`: Capacidad máxima de personas
- `pricePerHour`: Precio por hora
- `amenities`: Lista de comodidades disponibles
- `address`: Dirección física del lugar

### 2. Endpoint de Servicios
**URL**: `https://671fe0b3e7a5792f052fd920.mockapi.io/services`
**Descripción**: Obtiene los servicios disponibles para eventos.

#### Formato de Respuesta:
```json
[
  {
    "id": "s1",
    "name": "Catering Ejecutivo",
    "pricePerPerson": 45,
    "minimumPeople": 20
  }
]
```

#### Campos de Respuesta:
- `id`: Identificador único del servicio
- `name`: Nombre del servicio
- `pricePerPerson`: Precio por persona
- `minimumPeople`: Cantidad mínima de personas requerida

### 3. Endpoint de Disponibilidad
**URL**: `https://671fe287e7a5792f052fdf93.mockapi.io/availability`
**Descripción**: Verifica la disponibilidad de lugares en fechas específicas.

#### Formato de Respuesta:
```json
[
  {
    "id": "1",
    "venueId": "v1",
    "date": "2024-10-28",
    "available": false
  }
]
```

#### Campos de Respuesta:
- `id`: Identificador único del registro de disponibilidad
- `venueId`: Referencia al lugar
- `date`: Fecha para verificar disponibilidad
- `available`: Booleano indicando si está disponible

### 4. Endpoint de Reservas
**URL**: `https://671fe287e7a5792f052fdf93.mockapi.io/bookings`
**Descripción**: Crea una nueva reserva.

#### Formato de Solicitud:
```json
{
  "bookingCode": "TEC2810A123",
  "companyName": "Tech Solutions Inc",
  "companyEmail": "events@techsolutions.com",
  "contactPhone": "+1234567890",
  "venueId": "v1",
  "eventDate": "2024-10-28",
  "startTime": "14:00",
  "endTime": "20:00",
  "totalPeople": 150,
  "services": [
    {
      "serviceId": "s1",
      "quantity": 150,
      "pricePerPerson": 45,
      "startTime": "15:00",
      "endTime": "17:00"
    }
  ],
  "totalAmount": 9000,
  "status": "confirmed"
}
```
**URL**: `https://671fe287e7a5792f052fdf93.mockapi.io/bookings`
**Descripción**: Obtiene una lista de reservas.
#### Formato de Respuesta:
```json
{
  "id": "b1",
  "bookingCode": "TEC2810A123",
  "companyName": "Tech Solutions Inc",
  "companyEmail": "events@techsolutions.com",
  "contactPhone": "+1234567890",
  "venueId": "v1",
  "eventDate": "2024-10-28",
  "startTime": "14:00",
  "endTime": "20:00",
  "totalPeople": 150,
  "services": [
    {
      "serviceId": "s1",
      "quantity": 150,
      "pricePerPerson": 45,
      "startTime": "15:00",
      "endTime": "17:00"
    }
  ],
  "totalAmount": 9000,
  "status": "confirmed",
  "createdAt": "2024-10-15T10:30:00Z"
}
```

#### Campos de Solicitud/Respuesta:
- `id`: Identificador único de la reserva (solo en respuesta)
- `bookingCode`: Código único de referencia
- `companyName`: Nombre de la empresa
- `companyEmail`: Email de contacto
- `contactPhone`: Teléfono de contacto
- `venueId`: Referencia al lugar seleccionado
- `eventDate`: Fecha del evento
- `startTime`: Hora de inicio
- `endTime`: Hora de finalización
- `totalPeople`: Número total de asistentes
- `services`: Array de servicios seleccionados con detalles
- `totalAmount`: Costo total de la reserva
- `status`: Estado actual de la reserva
- `createdAt`: Fecha de creación (solo en respuesta)

## Notas Importantes
- Todas las fechas deben estar en formato ISO 8601
- Las horas deben estar en formato 24 horas
- Los valores monetarios están en la unidad de moneda predeterminada
- Los estados posibles son: "pending", "confirmed", "cancelled"
- En el archivo environment podrán encontrar las apis correspondientes al parcial. **import { environment } from './environment';**


---

> ⚠️ **¡ADVERTENCIA IMPORTANTE!** ⚠️
>
> ### Uso Obligatorio de MockAPI
> 
> - **ES OBLIGATORIO** utilizar las APIs de MockAPI proporcionadas en este documento.
> - El archivo `db.json` se proporciona **ÚNICAMENTE** como último recurso en caso de problemas técnicos graves con MockAPI.
> - **NO** está permitido migrar el proyecto a `db.json` por preferencia personal o conveniencia.
> - **CUALQUIER** modificación no autorizada o migración injustificada a `db.json` resultará en una **REDUCCIÓN SIGNIFICATIVA** de la calificación.
>
> 📝 **Nota**: La evaluación considera el uso correcto de las APIs proporcionadas como un requisito fundamental del proyecto.
>
> ⚡ **Importante**: Solo se aceptará el uso de `db.json` con autorización previa y justificación técnica documentada.

---


