import { AdminMaintenanceTicket } from '@/types/admin';

export const initialTickets: AdminMaintenanceTicket[] = [
  { id: 't-1', unit: 'A-402', category: 'Plumbing', description: 'Bathroom faucet drips non-stop.', priority: 'Medium', status: 'In Progress', date: '2026-05-22' },
  { id: 't-2', unit: 'B-108', category: 'Electrical', description: 'Living room outlets lose current.', priority: 'High', status: 'Open', date: '2026-05-24' }
];
