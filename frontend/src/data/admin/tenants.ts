import { Tenant } from '@/types/admin';

export const initialTenants: Tenant[] = [
  { id: 't-1', name: 'Alexander Wright', unit: 'A-402', email: 'alex.w@gmail.com', phone: '555-0192', status: 'Active', leaseStart: '2025-01-01', leaseEnd: '2026-01-01' },
  { id: 't-2', name: 'Sophia Martinez', unit: 'B-108', email: 'sophia.m@outlook.com', phone: '555-0481', status: 'Active', leaseStart: '2024-06-15', leaseEnd: '2025-06-15' },
  { id: 't-3', name: 'Marcus Sterling', unit: 'A-205', email: 'm.sterling@domain.com', phone: '555-0374', status: 'Active', leaseStart: '2025-03-01', leaseEnd: '2026-03-01' }
];
