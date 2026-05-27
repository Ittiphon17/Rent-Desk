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
      startDate: '01 พฤษภาคม 2569',
      endDate: '31 พฤษภาคม 2569',
      invoiceDate: '25 พฤษภาคม 2569 10:15',
      amountWords: 'สี่พันเจ็ดร้อยยี่สิบหกบาทถ้วน',
      items: [
        { no: 1, item: 'ค่าเช่าห้องพัก', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'ค่าไฟฟ้า (เลขมิเตอร์ 7722-7834)', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'ค่าน้ำประปา (เลขมิเตอร์ 1005-1016)', quantity: 11, price: 18.0, total: 198 }
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
      startDate: '01 เมษายน 2569',
      endDate: '30 เมษายน 2569',
      invoiceDate: '25 เมษายน 2569 09:30',
      amountWords: 'สี่พันเจ็ดร้อยหกสิบสองบาทถ้วน',
      items: [
        { no: 1, item: 'ค่าเช่าห้องพัก', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'ค่าไฟฟ้า (เลขมิเตอร์ 7610-7722)', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'ค่าน้ำประปา (เลขมิเตอร์ 992-1005)', quantity: 13, price: 18.0, total: 234 }
      ]
    }
  },
];
