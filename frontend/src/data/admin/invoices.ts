import { AdminInvoice } from '@/types/admin';

export const initialInvoices: AdminInvoice[] = [
  { id: 'inv-1', tenantName: 'Alexander Wright', unit: 'A-402', amount: 1450, dueDate: '2026-06-01', status: 'Paid' },
  { id: 'inv-2', tenantName: 'Sophia Martinez', unit: 'B-108', amount: 1100, dueDate: '2026-06-05', status: 'Paid' },
  { id: 'inv-3', tenantName: 'Marcus Sterling', unit: 'A-205', amount: 1250, dueDate: '2026-06-10', status: 'Unpaid' }
];
