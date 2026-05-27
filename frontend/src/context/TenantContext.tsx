import React, { createContext, useState, useEffect } from 'react';
import { Invoice, MaintenanceTicket, Appeal } from '@/types/tenant';
import { initialInvoices } from '@/data/tenant/invoices';
import { initialTickets } from '@/data/tenant/tickets';
import { initialAppeals } from '@/data/tenant/appeals';

export interface TenantContextType {
  invoices: Invoice[];
  payInvoice: (id: string) => void;
  tickets: MaintenanceTicket[];
  addTicket: (category: string, priority: 'Low' | 'Medium' | 'High', description: string, images: string[]) => void;
  appeals: Appeal[];
  addAppeal: (name: string, phone: string, category: string, details: string) => void;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  // Sync state with localstorage to handle updates gracefully on client side
  useEffect(() => {
    const savedInvoices = localStorage.getItem('tenant_invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        if (!Array.isArray(parsed) || parsed.some((inv: any) => !inv.details || inv.amount === 1100)) {
          setInvoices(initialInvoices);
          localStorage.setItem('tenant_invoices', JSON.stringify(initialInvoices));
        } else {
          setInvoices(parsed);
        }
      } catch (e) {
        setInvoices(initialInvoices);
        localStorage.setItem('tenant_invoices', JSON.stringify(initialInvoices));
      }
    } else {
      setInvoices(initialInvoices);
      localStorage.setItem('tenant_invoices', JSON.stringify(initialInvoices));
    }

    const savedTickets = localStorage.getItem('tenant_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      setTickets(initialTickets);
      localStorage.setItem('tenant_tickets', JSON.stringify(initialTickets));
    }

    const savedAppeals = localStorage.getItem('tenant_appeals');
    if (savedAppeals) {
      setAppeals(JSON.parse(savedAppeals));
    } else {
      setAppeals(initialAppeals);
      localStorage.setItem('tenant_appeals', JSON.stringify(initialAppeals));
    }
  }, []);

  const updateInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem('tenant_invoices', JSON.stringify(newInvoices));
  };

  const updateTickets = (newTickets: MaintenanceTicket[]) => {
    setTickets(newTickets);
    localStorage.setItem('tenant_tickets', JSON.stringify(newTickets));
  };

  const updateAppeals = (newAppeals: Appeal[]) => {
    setAppeals(newAppeals);
    localStorage.setItem('tenant_appeals', JSON.stringify(newAppeals));
  };

  const payInvoice = (id: string) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' as const } : inv);
    updateInvoices(updated);
  };

  const addTicket = (category: string, priority: 'Low' | 'Medium' | 'High', description: string, images: string[]) => {
    const added: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      category,
      description,
      priority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      images
    };
    updateTickets([added, ...tickets]);
  };

  const addAppeal = (name: string, phone: string, category: string, details: string) => {
    const added: Appeal = {
      id: `apl-${Date.now()}`,
      complainantName: name,
      contactNumber: phone,
      category,
      details,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    updateAppeals([added, ...appeals]);
  };

  return (
    <TenantContext.Provider value={{
      invoices,
      payInvoice,
      tickets,
      addTicket,
      appeals,
      addAppeal
    }}>
      {children}
    </TenantContext.Provider>
  );
};
