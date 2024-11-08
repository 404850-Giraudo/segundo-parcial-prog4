// models/interfaces.ts
export interface Venue {
    id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
    amenities: string[];
    address: string;
    images: string[];
  }
  
  export interface Service {
    id: string;
    name: string;
    pricePerPerson: number;
    minimumPeople: number;
    description: string;
  }
  
  export interface Booking {
    id?: string;
    bookingCode?: string;
    companyName: string;
    companyEmail: string;
    contactPhone: string;
    venueId: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    totalPeople: number;
    services: BookingService[];
    totalAmount?: number;
    status?: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: Date;
  }
  
  export interface BookingService {
    serviceId: string;
    quantity: number;
    pricePerPerson: number;
    startTime: string;
    endTime: string;
  }
  