import { AdminMaintenanceTicket } from '@/types/admin';

export const initialTickets: AdminMaintenanceTicket[] = [
  { id: 't-1', unit: 'A-402', category: 'ระบบประปา', description: 'ก๊อกน้ำในห้องน้ำมีน้ำหยดตลอดเวลา', priority: 'Medium', status: 'In Progress', date: '2026-05-22' },
  { id: 't-2', unit: 'B-108', category: 'ระบบไฟฟ้า', description: 'เต้ารับในห้องนั่งเล่นไม่มีกระแสไฟฟ้า', priority: 'High', status: 'Open', date: '2026-05-24' }
];
