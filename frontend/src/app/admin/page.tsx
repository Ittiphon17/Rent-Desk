"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Tenant, Room, AdminInvoice, AdminMaintenanceTicket } from '@/types/admin';
import { initialTenants } from '@/data/admin/tenants';
import { initialRooms } from '@/data/admin/rooms';
import { initialInvoices } from '@/data/admin/invoices';
import { initialTickets } from '@/data/admin/tickets';

// Sub-components
import { OverviewMetrics } from '@/components/admin/OverviewMetrics';
import { UrgentTasksBoard } from '@/components/admin/UrgentTasksBoard';
import { KeyRackStatus } from '@/components/admin/KeyRackStatus';
import { TenantTable } from '@/components/admin/TenantTable';
import { RoomCard } from '@/components/admin/RoomCard';
import { TicketCard } from '@/components/admin/TicketCard';
import { OnboardTenantModal } from '@/components/admin/OnboardTenantModal';

import { 
  Building2, 
  Users, 
  Wrench, 
  LogOut, 
  Search, 
  Plus, 
  ChevronRight, 
  Shield, 
  Layers, 
  Home, 
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, initialize, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'rooms' | 'maintenance'>('overview');

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [invoices, setInvoices] = useState<AdminInvoice[]>(initialInvoices);
  const [tickets, setTickets] = useState<AdminMaintenanceTicket[]>(initialTickets);

  const [searchTerm, setSearchTerm] = useState('');
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Sync / Redirect guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_token_local') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_user') : null;
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'admin') {
        router.push('/login');
      }
    } catch(e) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = useMemo(() => {
    const totalRentCollected = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const totalRentPending = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const occupiedCount = rooms.filter(rm => rm.status === 'Occupied').length;
    const vacantCount = rooms.filter(rm => rm.status === 'Vacant').length;
    const activeMaintenanceCount = tickets.filter(tkt => tkt.status !== 'Resolved').length;

    return {
      totalRentCollected,
      totalRentPending,
      occupiedCount,
      vacantCount,
      activeMaintenanceCount
    };
  }, [rooms, invoices, tickets]);

  const handleOnboardSubmit = (tenantData: {
    name: string;
    unit: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  }) => {
    const added: Tenant = {
      id: `t-${Date.now()}`,
      name: tenantData.name,
      unit: tenantData.unit,
      email: tenantData.email || 'n/a',
      phone: tenantData.phone || 'n/a',
      status: 'Active',
      leaseStart: tenantData.leaseStart || new Date().toISOString().split('T')[0],
      leaseEnd: tenantData.leaseEnd || new Date(Date.now() + 31536e6).toISOString().split('T')[0]
    };

    setTenants([added, ...tenants]);
    setRooms(rooms.map(rm => rm.number === added.unit ? { ...rm, status: 'Occupied' } : rm));

    const defaultRent = rooms.find(rm => rm.number === added.unit)?.monthlyRent || 1200;
    const newInvoice: AdminInvoice = {
      id: `inv-${Date.now()}`,
      tenantName: added.name,
      unit: added.unit,
      amount: defaultRent,
      dueDate: new Date(Date.now() + 864e5 * 10).toISOString().split('T')[0],
      status: 'Unpaid'
    };
    setInvoices([newInvoice, ...invoices]);
    setIsTenantModalOpen(false);
  };

  const handleRemoveTenant = (id: string, unit: string) => {
    if (confirm('End lease and remove tenant?')) {
      setTenants(tenants.filter(t => t.id !== id));
      setRooms(rooms.map(rm => rm.number === unit ? { ...rm, status: 'Vacant' } : rm));
    }
  };

  const toggleRoomStatus = (number: string) => {
    setRooms(rooms.map(rm => {
      if (rm.number === number) {
        let nextStatus: 'Occupied' | 'Vacant' | 'Maintenance' = 'Vacant';
        if (rm.status === 'Vacant') nextStatus = 'Maintenance';
        else if (rm.status === 'Maintenance') nextStatus = 'Vacant';
        return { ...rm, status: nextStatus };
      }
      return rm;
    }));
  };

  const advanceTicketStatus = (id: string) => {
    setTickets(tickets.map(tkt => {
      if (tkt.id === id) {
        let nextStatus: 'Open' | 'In Progress' | 'Resolved' = 'Open';
        if (tkt.status === 'Open') nextStatus = 'In Progress';
        else if (tkt.status === 'In Progress') nextStatus = 'Resolved';
        return { ...tkt, status: nextStatus };
      }
      return tkt;
    }));
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = rooms.filter(r => 
    r.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFEDCE] text-[#2C1A1A] font-sans relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] rounded-full bg-[#FF8383]/10 blur-3xl pointer-events-none"></div>

      {/* Sidebar - Premium Glassmorphic look */}
      <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-[#FFC193]/30 bg-white/60 backdrop-blur-md p-6 md:flex relative z-10">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white shadow-lg shadow-[#FF3737]/20">
              <Building2 className="h-6.5 w-6.5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#FF8383] to-[#FF3737] bg-clip-text text-transparent">RentDesk</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">Admin Control</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', name: 'Overview Board', icon: Layers },
              { id: 'tenants', name: 'Manage Tenants', icon: Users },
              { id: 'rooms', name: 'Rooms & Units', icon: Home },
              { id: 'maintenance', name: 'Repair Inbox', icon: Wrench },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setSearchTerm(''); }}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-md shadow-[#FF3737]/15' 
                      : 'text-slate-500 hover:bg-[#FFC193]/15 hover:text-[#FF3737]'
                  }`}
                >
                  <Icon className="h-5.5 w-5.5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User tag */}
        <div className="space-y-4 rounded-2xl border border-[#FFC193]/40 bg-white/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white font-bold">
              A
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800">{user?.username || 'Admin'}</span>
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#FF3737]">
                <Shield className="h-3 w-3" />
                SYSTEM ROOT
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF8383]/40 bg-white py-2.5 text-xs font-bold text-[#FF3737] hover:bg-[#FF8383]/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex flex-1 flex-col overflow-y-auto relative z-10">
        <header className="flex h-20 items-center justify-between border-b border-[#FFC193]/30 bg-white/40 backdrop-blur-md px-8">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white">
              <Building2 className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#FF3737]">RentDesk</span>
          </div>

          <div className="hidden items-center gap-1 md:flex text-sm font-semibold">
            <span className="text-slate-400">Admin Area /</span>
            <span className="text-[#FF3737] capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="rounded-xl border border-[#FFC193]/65 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="overview">Overview</option>
              <option value="tenants">Tenants</option>
              <option value="rooms">Rooms</option>
              <option value="maintenance">Repairs</option>
            </select>
            <button 
              onClick={handleLogout} 
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF8383]/40 bg-white text-[#FF3737]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">Console Board</h1>
                  <p className="mt-1.5 text-sm text-slate-500 font-semibold">Manage leases, rent books, and tenant tickets in style.</p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-[#FFC193]/40 px-3.5 py-1.5 text-xs font-extrabold text-[#FF3737]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Sync
                </div>
              </div>

              {/* Metrics Component */}
              <OverviewMetrics stats={stats} />

              {/* Lists */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Urgent Tasks Board Component */}
                <UrgentTasksBoard tickets={tickets} setActiveTab={setActiveTab} />

                {/* Key Rack Status Component */}
                <KeyRackStatus rooms={rooms} setActiveTab={setActiveTab} />
              </div>
            </div>
          )}

          {/* TAB: TENANTS */}
          {activeTab === 'tenants' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Tenant Roster</h1>
                  <p className="text-slate-500 text-sm font-semibold">Track currently active leases and registers.</p>
                </div>
                
                <button
                  onClick={() => setIsTenantModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] px-4.5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98]"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Onboard Tenant</span>
                </button>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737]"
                />
              </div>

              {/* Tenant Table Component */}
              <TenantTable filteredTenants={filteredTenants} handleRemoveTenant={handleRemoveTenant} />
            </div>
          )}

          {/* TAB: ROOMS */}
          {activeTab === 'rooms' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Apartments Manager</h1>
                <p className="text-slate-500 text-sm font-semibold">Set vacancy modes or toggle rooms to cleaning/maintenance status.</p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredRooms.map(rm => (
                  <RoomCard key={rm.id} rm={rm} toggleRoomStatus={toggleRoomStatus} />
                ))}
              </div>
            </div>
          )}

          {/* TAB: REPAIRS */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Work Tickets Inbox</h1>
                <p className="text-slate-500 text-sm font-semibold">Assign tasks, inspect tenant uploads, and resolve repairs.</p>
              </div>

              <div className="space-y-3">
                {tickets.map(tkt => (
                  <TicketCard key={tkt.id} tkt={tkt} advanceTicketStatus={advanceTicketStatus} />
                ))}
                {tickets.length === 0 && (
                  <p className="text-center py-10 font-bold text-slate-400">All maintenance queries resolved.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Onboard Tenant Modal Component */}
      {isTenantModalOpen && (
        <OnboardTenantModal
          rooms={rooms}
          onClose={() => setIsTenantModalOpen(false)}
          onSubmit={handleOnboardSubmit}
        />
      )}
    </div>
  );
}
