import { Room } from '@/types/admin';

export const initialRooms: Room[] = [
  { id: 'rm-101', number: 'A-101', type: 'Studio', status: 'Vacant', monthlyRent: 950 },
  { id: 'rm-108', number: 'B-108', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1100 },
  { id: 'rm-205', number: 'A-205', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1250 },
  { id: 'rm-301', number: 'C-301', type: '2-Bedroom', status: 'Vacant', monthlyRent: 1600 },
  { id: 'rm-402', number: 'A-402', type: '2-Bedroom', status: 'Occupied', monthlyRent: 1450 },
  { id: 'rm-501', number: 'Penthouse-501', type: 'Penthouse', status: 'Maintenance', monthlyRent: 3200 }
];
