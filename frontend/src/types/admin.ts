export interface Tenant {
  id: string;
  name: string;
  unit: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending';
  leaseStart: string;
  leaseEnd: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse';
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  monthlyRent: number;
}

export interface AdminInvoice {
  id: string;
  tenantName: string;
  unit: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface AdminMaintenanceTicket {
  id: string;
  unit: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}
