import { Invoice } from '@/types/tenant';

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    amount: 4726,
    dueDate: '2026-06-01',
    status: 'Unpaid',
    month: 'June 2026',
    details: {
      name: 'Adum Smit',
      room: '504',
      startDate: '01 May 2026',
      endDate: '31 May 2026',
      invoiceDate: '25 May 2026 10:15',
      amountWords: 'Four thousand seven hundred and twenty-six baht only',
      items: [
        { no: 1, item: 'Room Rate', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'Electricity Charge 7722-7834', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'Water Charge 1005-1016', quantity: 11, price: 18.0, total: 198 }
      ]
    }
  },
  {
    id: 'inv-100',
    amount: 4762,
    dueDate: '2026-05-01',
    status: 'Paid',
    month: 'May 2026',
    details: {
      name: 'Adum Smit',
      room: '504',
      startDate: '01 April 2026',
      endDate: '30 April 2026',
      invoiceDate: '25 April 2026 09:30',
      amountWords: 'Four thousand seven hundred and sixty-two baht only',
      items: [
        { no: 1, item: 'Room Rate', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'Electricity Charge 7610-7722', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'Water Charge 992-1005', quantity: 13, price: 18.0, total: 234 }
      ]
    }
  },
];
