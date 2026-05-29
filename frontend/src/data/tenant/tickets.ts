import { MaintenanceTicket } from '@/types/tenant';

export const initialTickets: MaintenanceTicket[] = [
  { 
    id: 'tkt-1', 
    category: 'ระบบปรับอากาศ', 
    description: 'เครื่องปรับอากาศเป่าลมร้อนออกมา', 
    priority: 'Medium', 
    status: 'In Progress', 
    date: '2026-05-20', 
    images: [] 
  }
];
