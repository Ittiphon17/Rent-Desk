"use client";

import React, { createContext, useState, useEffect } from 'react';
import { Tenant, Room, AdminInvoice, AdminMaintenanceTicket } from '@/types/admin';
import { Appeal } from '@/types/tenant';
import { initialTenants } from '@/data/admin/tenants';
import { initialRooms } from '@/data/admin/rooms';
import { initialInvoices } from '@/data/admin/invoices';
import { initialTickets } from '@/data/admin/tickets';
import { initialAppeals } from '@/data/tenant/appeals';

export interface AdminContextType {
  tenants: Tenant[];
  rooms: Room[];
  invoices: AdminInvoice[];
  tickets: AdminMaintenanceTicket[];
  appeals: Appeal[];

  addTenant: (tenantData: {
    name: string;
    unit: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  }) => void;
  editTenant: (id: string, updatedData: Partial<Tenant>) => void;
  removeTenant: (id: string, unit: string) => void;

  addRoom: (roomData: {
    number: string;
    type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse';
    monthlyRent: number;
    status: 'Occupied' | 'Vacant' | 'Maintenance';
  }) => void;
  editRoom: (id: string, updatedData: Partial<Room>) => void;
  toggleRoomStatus: (number: string) => void;

  updateInvoiceStatus: (id: string, status: 'Paid' | 'Unpaid' | 'Overdue' | 'Verificata' | 'Settled') => void;

  advanceTicketStatus: (id: string) => void;
  updateTicketStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => void;

  updateAppealStatus: (id: string, status: 'Pending' | 'In Review' | 'Resolved') => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [tickets, setTickets] = useState<AdminMaintenanceTicket[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  // Load all initial state
  useEffect(() => {
    // 1. Tenants
    const savedTenants = localStorage.getItem('admin_tenants');
    let loadedTenants = initialTenants;
    if (savedTenants) {
      try {
        loadedTenants = JSON.parse(savedTenants);
      } catch (e) {
        loadedTenants = initialTenants;
      }
    } else {
      localStorage.setItem('admin_tenants', JSON.stringify(initialTenants));
    }
    setTenants(loadedTenants);

    // 2. Rooms
    const savedRooms = localStorage.getItem('admin_rooms');
    let loadedRooms = initialRooms;
    if (savedRooms) {
      try {
        loadedRooms = JSON.parse(savedRooms);
      } catch (e) {
        loadedRooms = initialRooms;
      }
    } else {
      localStorage.setItem('admin_rooms', JSON.stringify(initialRooms));
    }
    setRooms(loadedRooms);

    // 3. Invoices (Merge admin_invoices and tenant_invoices)
    const savedAdminInvoices = localStorage.getItem('admin_invoices');
    let loadedAdminInvoices = initialInvoices;
    if (savedAdminInvoices) {
      try {
        loadedAdminInvoices = JSON.parse(savedAdminInvoices);
      } catch (e) {
        loadedAdminInvoices = initialInvoices;
      }
    } else {
      localStorage.setItem('admin_invoices', JSON.stringify(initialInvoices));
    }

    const savedTenantInvoices = localStorage.getItem('tenant_invoices');
    let tenantInvoicesList = [];
    if (savedTenantInvoices) {
      try {
        tenantInvoicesList = JSON.parse(savedTenantInvoices);
      } catch (e) { }
    }

    const mappedTenantInvoices: AdminInvoice[] = tenantInvoicesList.map((tInv: any) => ({
      id: tInv.id,
      tenantName: tInv.details?.name || 'Alexander Wright',
      unit: tInv.details?.room || 'A-402',
      amount: tInv.amount,
      dueDate: tInv.dueDate,
      status: tInv.status,
      slipImage: tInv.slipImage,
      month: tInv.month || new Date(tInv.dueDate).toLocaleString('th-TH', { month: 'long', year: 'numeric' })
    }));

    // Combine them, avoiding duplicates by id
    const invoiceMap = new Map<string, AdminInvoice>();
    loadedAdminInvoices.forEach(inv => invoiceMap.set(inv.id, inv));
    mappedTenantInvoices.forEach(inv => invoiceMap.set(inv.id, inv));
    setInvoices(Array.from(invoiceMap.values()));

    // 4. Tickets (Merge admin_tickets and tenant_tickets)
    const savedAdminTickets = localStorage.getItem('admin_tickets');
    let loadedAdminTickets = initialTickets;
    if (savedAdminTickets) {
      try {
        loadedAdminTickets = JSON.parse(savedAdminTickets);
      } catch (e) {
        loadedAdminTickets = initialTickets;
      }
    } else {
      localStorage.setItem('admin_tickets', JSON.stringify(initialTickets));
    }

    const savedTenantTickets = localStorage.getItem('tenant_tickets');
    let tenantTicketsList = [];
    if (savedTenantTickets) {
      try {
        tenantTicketsList = JSON.parse(savedTenantTickets);
      } catch (e) { }
    }

    const mappedTenantTickets: AdminMaintenanceTicket[] = tenantTicketsList.map((t: any) => ({
      id: t.id,
      unit: 'A-402', // Simulate that the tenant files tickets for A-402
      category: t.category,
      description: t.description,
      priority: t.priority,
      status: t.status,
      date: t.date
    }));

    const ticketMap = new Map<string, AdminMaintenanceTicket>();
    loadedAdminTickets.forEach(tkt => ticketMap.set(tkt.id, tkt));
    mappedTenantTickets.forEach(tkt => ticketMap.set(tkt.id, tkt));
    setTickets(Array.from(ticketMap.values()));

    // 5. Appeals (Merge admin_appeals and tenant_appeals)
    const savedAdminAppeals = localStorage.getItem('admin_appeals');
    let loadedAdminAppeals: Appeal[] = [];
    if (savedAdminAppeals) {
      try {
        loadedAdminAppeals = JSON.parse(savedAdminAppeals);
      } catch (e) { }
    } else {
      localStorage.setItem('admin_appeals', JSON.stringify([]));
    }

    const savedTenantAppeals = localStorage.getItem('tenant_appeals');
    let tenantAppealsList = initialAppeals;
    if (savedTenantAppeals) {
      try {
        tenantAppealsList = JSON.parse(savedTenantAppeals);
      } catch (e) { }
    } else {
      localStorage.setItem('tenant_appeals', JSON.stringify(initialAppeals));
    }

    const appealMap = new Map<string, Appeal>();
    loadedAdminAppeals.forEach(apl => appealMap.set(apl.id, apl));
    tenantAppealsList.forEach(apl => appealMap.set(apl.id, apl));
    setAppeals(Array.from(appealMap.values()));
  }, []);

  const addTenant = (tenantData: {
    name: string;
    unit: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  }) => {
    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name: tenantData.name,
      unit: tenantData.unit,
      email: tenantData.email || 'n/a',
      phone: tenantData.phone || 'n/a',
      status: 'Active',
      leaseStart: tenantData.leaseStart || new Date().toISOString().split('T')[0],
      leaseEnd: tenantData.leaseEnd || new Date(Date.now() + 31536e6).toISOString().split('T')[0]
    };

    const updatedTenants = [newTenant, ...tenants];
    setTenants(updatedTenants);
    localStorage.setItem('admin_tenants', JSON.stringify(updatedTenants));

    // Update Room Status
    const updatedRooms = rooms.map(rm => rm.number === tenantData.unit ? { ...rm, status: 'Occupied' as const } : rm);
    setRooms(updatedRooms);
    localStorage.setItem('admin_rooms', JSON.stringify(updatedRooms));

    // Generate Invoice
    const defaultRent = rooms.find(rm => rm.number === tenantData.unit)?.monthlyRent || 1200;
    const newInvoice: AdminInvoice = {
      id: `inv-${Date.now()}`,
      tenantName: newTenant.name,
      unit: newTenant.unit,
      amount: defaultRent,
      dueDate: new Date(Date.now() + 864e5 * 10).toISOString().split('T')[0],
      status: 'Unpaid'
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('admin_invoices', JSON.stringify(updatedInvoices.filter(inv => !inv.id.startsWith('inv-10'))));
  };

  const editTenant = (id: string, updatedData: Partial<Tenant>) => {
    const updated = tenants.map(t => {
      if (t.id === id) {
        // If room unit changes, swap status of the rooms
        if (updatedData.unit && updatedData.unit !== t.unit) {
          // Free the old room
          setRooms(prev => {
            const next = prev.map(r => {
              if (r.number === t.unit) return { ...r, status: 'Vacant' as const };
              if (r.number === updatedData.unit) return { ...r, status: 'Occupied' as const };
              return r;
            });
            localStorage.setItem('admin_rooms', JSON.stringify(next));
            return next;
          });
        }
        return { ...t, ...updatedData };
      }
      return t;
    });
    setTenants(updated);
    localStorage.setItem('admin_tenants', JSON.stringify(updated));
  };

  const removeTenant = (id: string, unit: string) => {
    const updated = tenants.filter(t => t.id !== id);
    setTenants(updated);
    localStorage.setItem('admin_tenants', JSON.stringify(updated));

    const updatedRooms = rooms.map(rm => rm.number === unit ? { ...rm, status: 'Vacant' as const } : rm);
    setRooms(updatedRooms);
    localStorage.setItem('admin_rooms', JSON.stringify(updatedRooms));
  };

  const addRoom = (roomData: {
    number: string;
    type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse';
    monthlyRent: number;
    status: 'Occupied' | 'Vacant' | 'Maintenance';
  }) => {
    const newRoom: Room = {
      id: `rm-${Date.now()}`,
      ...roomData
    };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    localStorage.setItem('admin_rooms', JSON.stringify(updated));
  };

  const editRoom = (id: string, updatedData: Partial<Room>) => {
    const updated = rooms.map(r => r.id === id ? { ...r, ...updatedData } : r);
    setRooms(updated);
    localStorage.setItem('admin_rooms', JSON.stringify(updated));
  };

  const toggleRoomStatus = (number: string) => {
    const updated = rooms.map(rm => {
      if (rm.number === number) {
        let nextStatus: 'Occupied' | 'Vacant' | 'Maintenance' = 'Vacant';
        if (rm.status === 'Vacant') nextStatus = 'Maintenance';
        else if (rm.status === 'Maintenance') nextStatus = 'Vacant';
        return { ...rm, status: nextStatus };
      }
      return rm;
    });
    setRooms(updated);
    localStorage.setItem('admin_rooms', JSON.stringify(updated));
  };

  const updateInvoiceStatus = (id: string, status: 'Paid' | 'Unpaid' | 'Overdue' | 'Verificata' | 'Settled') => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status } : inv);
    setInvoices(updated);

    // If it is a tenant invoice, sync it back to tenant_invoices
    if (id.startsWith('inv-10')) {
      const savedTenantInvoices = localStorage.getItem('tenant_invoices');
      if (savedTenantInvoices) {
        try {
          const tenantInvoicesList = JSON.parse(savedTenantInvoices);
          const nextTenantInvoices = tenantInvoicesList.map((tInv: any) =>
            tInv.id === id ? { ...tInv, status } : tInv
          );
          localStorage.setItem('tenant_invoices', JSON.stringify(nextTenantInvoices));
        } catch (e) { }
      }
    } else {
      localStorage.setItem('admin_invoices', JSON.stringify(updated.filter(inv => !inv.id.startsWith('inv-10'))));
    }
  };

  const advanceTicketStatus = (id: string) => {
    const updated = tickets.map(tkt => {
      if (tkt.id === id) {
        let nextStatus: 'Open' | 'In Progress' | 'Resolved' = 'Open';
        if (tkt.status === 'Open') nextStatus = 'In Progress';
        else if (tkt.status === 'In Progress') nextStatus = 'Resolved';

        // Sync with tenant tickets if it belongs to tenant
        if (id.startsWith('tkt-') || id === 't-1' || id === 't-2') {
          const savedTenantTickets = localStorage.getItem('tenant_tickets');
          if (savedTenantTickets) {
            try {
              const tenantTicketsList = JSON.parse(savedTenantTickets);
              const nextTenantTickets = tenantTicketsList.map((t: any) =>
                t.id === id ? { ...t, status: nextStatus } : t
              );
              localStorage.setItem('tenant_tickets', JSON.stringify(nextTenantTickets));
            } catch (e) { }
          }
        }
        return { ...tkt, status: nextStatus };
      }
      return tkt;
    });
    setTickets(updated);
    localStorage.setItem('admin_tickets', JSON.stringify(updated.filter(tkt => !tkt.id.startsWith('tkt-'))));
  };

  const updateTicketStatus = (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    const updated = tickets.map(tkt => {
      if (tkt.id === id) {
        // Sync with tenant tickets if it belongs to tenant
        if (id.startsWith('tkt-') || id === 't-1' || id === 't-2') {
          const savedTenantTickets = localStorage.getItem('tenant_tickets');
          if (savedTenantTickets) {
            try {
              const tenantTicketsList = JSON.parse(savedTenantTickets);
              const nextTenantTickets = tenantTicketsList.map((t: any) =>
                t.id === id ? { ...t, status } : t
              );
              localStorage.setItem('tenant_tickets', JSON.stringify(nextTenantTickets));
            } catch (e) { }
          }
        }
        return { ...tkt, status };
      }
      return tkt;
    });
    setTickets(updated);
    localStorage.setItem('admin_tickets', JSON.stringify(updated.filter(tkt => !tkt.id.startsWith('tkt-'))));
  };

  const updateAppealStatus = (id: string, status: 'Pending' | 'In Review' | 'Resolved') => {
    const updated = appeals.map(apl => {
      if (apl.id === id) {
        // Sync with tenant appeals if it belongs to tenant
        if (id.startsWith('apl-') || id === 'apl-1') {
          const savedTenantAppeals = localStorage.getItem('tenant_appeals');
          if (savedTenantAppeals) {
            try {
              const tenantAppealsList = JSON.parse(savedTenantAppeals);
              const nextTenantAppeals = tenantAppealsList.map((t: any) =>
                t.id === id ? { ...t, status } : t
              );
              localStorage.setItem('tenant_appeals', JSON.stringify(nextTenantAppeals));
            } catch (e) { }
          }
        }
        return { ...apl, status };
      }
      return apl;
    });
    setAppeals(updated);
    localStorage.setItem('admin_appeals', JSON.stringify(updated.filter(apl => !apl.id.startsWith('apl-') && apl.id !== 'apl-1')));
  };

  return (
    <AdminContext.Provider value={{
      tenants,
      rooms,
      invoices,
      tickets,
      appeals,
      addTenant,
      editTenant,
      removeTenant,
      addRoom,
      editRoom,
      toggleRoomStatus,
      updateInvoiceStatus,
      advanceTicketStatus,
      updateTicketStatus,
      updateAppealStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};
