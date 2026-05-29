export interface InvoiceDetailItem {
  no: number;
  item: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceDetails {
  name: string;
  room: string;
  startDate: string;
  endDate: string;
  invoiceDate: string;
  items: InvoiceDetailItem[];
  amountWords: string;
}

export interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Verificata' | 'Settled';
  month: string;
  details?: InvoiceDetails;
  slipImage?: string;
}

export interface MaintenanceTicket {
  id: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  images?: string[];
}

export interface Appeal {
  id: string;
  complainantName: string;
  contactNumber: string;
  category: string;
  details: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  date: string;
}
