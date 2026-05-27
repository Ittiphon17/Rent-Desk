import { MaintenanceTicket } from '@/types/tenant';

export const initialTickets: MaintenanceTicket[] = [
  { 
    id: 'tkt-1', 
    category: 'HVAC', 
    description: 'Air conditioner is blowing warm air.', 
    priority: 'Medium', 
    status: 'In Progress', 
    date: '2026-05-20', 
    images: [] 
  }
];
