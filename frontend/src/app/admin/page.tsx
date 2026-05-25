"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wrench, 
  LogOut, 
  User, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
  Home,
  Trash2,
  Phone,
  Mail,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  unit: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending';
  leaseStart: string;
  leaseEnd: string;
}

interface Room {
  id: string;
  number: string;
  type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse';
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  monthlyRent: number;
}

interface Invoice {
  id: string;
  tenantName: string;
  unit: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

interface MaintenanceTicket {
  id: string;
  unit: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

const initialTenants: Tenant[] = [
  { id: 't-1', name: 'Alexander Wright', unit: 'A-402', email: 'alex.w@gmail.com', phone: '555-0192', status: 'Active', leaseStart: '2025-01-01', leaseEnd: '2026-01-01' },
  { id: 't-2', name: 'Sophia Martinez', unit: 'B-108', email: 'sophia.m@outlook.com', phone: '555-0481', status: 'Active', leaseStart: '2024-06-15', leaseEnd: '2025-06-15' },
  { id: 't-3', name: 'Marcus Sterling', unit: 'A-205', email: 'm.sterling@domain.com', phone: '555-0374', status: 'Active', leaseStart: '2025-03-01', leaseEnd: '2026-03-01' }
];

const initialRooms: Room[] = [
  { id: 'rm-101', number: 'A-101', type: 'Studio', status: 'Vacant', monthlyRent: 950 },
  { id: 'rm-108', number: 'B-108', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1100 },
  { id: 'rm-205', number: 'A-205', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1250 },
  { id: 'rm-301', number: 'C-301', type: '2-Bedroom', status: 'Vacant', monthlyRent: 1600 },
  { id: 'rm-402', number: 'A-402', type: '2-Bedroom', status: 'Occupied', monthlyRent: 1450 },
  { id: 'rm-501', number: 'Penthouse-501', type: 'Penthouse', status: 'Maintenance', monthlyRent: 3200 }
];

const initialInvoices: Invoice[] = [
  { id: 'inv-1', tenantName: 'Alexander Wright', unit: 'A-402', amount: 1450, dueDate: '2026-06-01', status: 'Paid' },
  { id: 'inv-2', tenantName: 'Sophia Martinez', unit: 'B-108', amount: 1100, dueDate: '2026-06-05', status: 'Paid' },
  { id: 'inv-3', tenantName: 'Marcus Sterling', unit: 'A-205', amount: 1250, dueDate: '2026-06-10', status: 'Unpaid' }
];

const initialTickets: MaintenanceTicket[] = [
  { id: 't-1', unit: 'A-402', category: 'Plumbing', description: 'Bathroom faucet drips non-stop.', priority: 'Medium', status: 'In Progress', date: '2026-05-22' },
  { id: 't-2', unit: 'B-108', category: 'Electrical', description: 'Living room outlets lose current.', priority: 'High', status: 'Open', date: '2026-05-24' }
];

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, initialize, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'rooms' | 'maintenance'>('overview');

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(initialTickets);

  const [searchTerm, setSearchTerm] = useState('');
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const [newTenant, setNewTenant] = useState({
    name: '', unit: '', email: '', phone: '', leaseStart: '', leaseEnd: ''
  });

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

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name.trim() || !newTenant.unit.trim()) return;

    const added: Tenant = {
      id: `t-${Date.now()}`,
      name: newTenant.name,
      unit: newTenant.unit,
      email: newTenant.email || 'n/a',
      phone: newTenant.phone || 'n/a',
      status: 'Active',
      leaseStart: newTenant.leaseStart || new Date().toISOString().split('T')[0],
      leaseEnd: newTenant.leaseEnd || new Date(Date.now() + 31536e6).toISOString().split('T')[0]
    };

    setTenants([added, ...tenants]);
    setRooms(rooms.map(rm => rm.number === added.unit ? { ...rm, status: 'Occupied' } : rm));

    const defaultRent = rooms.find(rm => rm.number === added.unit)?.monthlyRent || 1200;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      tenantName: added.name,
      unit: added.unit,
      amount: defaultRent,
      dueDate: new Date(Date.now() + 864e5 * 10).toISOString().split('T')[0],
      status: 'Unpaid'
    };
    setInvoices([newInvoice, ...invoices]);

    setIsTenantModalOpen(false);
    setNewTenant({ name: '', unit: '', email: '', phone: '', leaseStart: '', leaseEnd: '' });
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

              {/* Metrics */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFEDCE] text-[#FF3737]">
                      <DollarSign className="h-5.5 w-5.5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">${stats.totalRentCollected}</span>
                    <span className="block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-max">Active Cycle</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Awaiting Pay</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Clock className="h-5.5 w-5.5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-orange-700">${stats.totalRentPending}</span>
                    <span className="block mt-1 text-[10px] text-slate-400 font-medium">Invoices open</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupancy</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#FF3737]">
                      <Users className="h-5.5 w-5.5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">{stats.occupiedCount} Units</span>
                    <span className="block mt-1 text-[10px] text-slate-400 font-medium">{stats.vacantCount} spaces vacant</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Tickets</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <Wrench className="h-5.5 w-5.5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-rose-700">{stats.activeMaintenanceCount} Tasks</span>
                    <span className="block mt-1 text-[10px] text-slate-400 font-medium">Technicians needed</span>
                  </div>
                </div>
              </div>

              {/* Lists */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Repairs */}
                <div className="md:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Urgent Tasks Board</h3>
                    <button onClick={() => setActiveTab('maintenance')} className="text-xs font-bold text-[#FF3737] hover:underline flex items-center gap-0.5">
                      Dispatch <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {tickets.filter(t => t.status !== 'Resolved').slice(0, 2).map(tkt => (
                      <div key={tkt.id} className="rounded-xl border border-[#FFC193]/20 bg-[#FFEDCE]/20 p-4 flex justify-between items-center">
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">Unit {tkt.unit} - {tkt.category}</span>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{tkt.description}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          tkt.priority === 'High' ? 'bg-[#FF3737]/10 text-[#FF3737] border border-[#FF3737]/20' : 'bg-amber-100 text-amber-700'
                        }`}>{tkt.priority}</span>
                      </div>
                    ))}
                    {tickets.filter(t => t.status !== 'Resolved').length === 0 && (
                      <p className="text-slate-450 text-center py-6 font-semibold">Repairs queue clear!</p>
                    )}
                  </div>
                </div>

                {/* Rooms Quick View */}
                <div className="md:col-span-5 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Key Rack Status</h3>
                    <button onClick={() => setActiveTab('rooms')} className="text-xs font-bold text-[#FF3737] hover:underline flex items-center gap-0.5">
                      Browse <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {rooms.slice(0, 6).map(rm => (
                      <div key={rm.id} className={`rounded-xl p-2.5 border text-center font-bold ${
                        rm.status === 'Occupied' ? 'bg-[#FFC193]/15 border-[#FFC193]/40 text-slate-800' :
                        rm.status === 'Maintenance' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                        'bg-white border-slate-100 text-slate-450'
                      }`}>
                        <span className="block text-xs">{rm.number}</span>
                        <span className="text-[8px] uppercase tracking-wider block mt-0.5">{rm.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
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

              {/* Table */}
              <div className="overflow-hidden rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-[#FFEDCE]/40 text-xs font-bold uppercase tracking-wider text-[#FF3737] border-b border-[#FFC193]/20">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Room Unit</th>
                        <th className="px-6 py-4">Contacts</th>
                        <th className="px-6 py-4">Lease Term</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFC193]/20">
                      {filteredTenants.length > 0 ? (
                        filteredTenants.map(tenant => (
                          <tr key={tenant.id} className="hover:bg-[#FFEDCE]/10 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{tenant.name}</td>
                            <td className="px-6 py-4 font-bold font-mono text-[#FF3737]">{tenant.unit}</td>
                            <td className="px-6 py-4 space-y-0.5 text-xs font-semibold">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                <span>{tenant.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{tenant.phone}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>{tenant.leaseStart} to {tenant.leaseEnd}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRemoveTenant(tenant.id, tenant.unit)}
                                className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 px-2.5 py-1.5 text-xs font-bold text-rose-700"
                              >
                                <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                                Evict/End Lease
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">No tenants currently registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ROOMS TAB */}
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
                  <div key={rm.id} className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-slate-900">{rm.number}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                          rm.status === 'Occupied' ? 'bg-[#FFC193]/20 text-[#FF3737] border border-[#FFC193]/40' :
                          rm.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>{rm.status}</span>
                      </div>
                      <span className="block mt-1 text-xs font-semibold text-slate-400">{rm.type} Unit</span>
                      <span className="block mt-1 text-sm font-bold text-slate-700">${rm.monthlyRent}/month</span>
                    </div>

                    <button
                      onClick={() => toggleRoomStatus(rm.number)}
                      className="w-full mt-5 rounded-xl bg-[#FFEDCE]/50 hover:bg-[#FFC193]/30 border border-[#FFC193]/50 py-2 text-xs font-bold text-[#FF3737]"
                    >
                      Cycle Room Status
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPAIRS TAB */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Work Tickets Inbox</h1>
                <p className="text-slate-500 text-sm font-semibold">Assign tasks, inspect tenant uploads, and resolve repairs.</p>
              </div>

              <div className="space-y-3">
                {tickets.map(tkt => (
                  <div key={tkt.id} className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">Room Unit {tkt.unit}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          tkt.priority === 'High' ? 'bg-[#FF3737]/10 text-[#FF3737]' : 'bg-amber-100 text-amber-800'
                        }`}>{tkt.priority} priority</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-[#FF3737] uppercase">{tkt.category}</h4>
                      <p className="text-sm text-slate-655 font-medium">{tkt.description}</p>
                      <span className="block text-[10px] font-bold text-slate-400">Filed Date: {tkt.date}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                        tkt.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800' :
                        tkt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {tkt.status}
                      </span>
                      {tkt.status !== 'Resolved' && (
                        <button
                          onClick={() => advanceTicketStatus(tkt.id)}
                          className="rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-4 py-2.5 text-xs font-bold shadow"
                        >
                          {tkt.status === 'Open' ? 'Begin Work' : 'Close Ticket'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-center py-10 font-bold text-slate-400">All maintenance queries resolved.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: ONBOARD */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#FFC193]/50 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-150 p-5 bg-[#FFEDCE]/30">
              <h3 className="text-base font-bold text-slate-900">Register Resident</h3>
              <button onClick={() => setIsTenantModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Tenant Full Name</label>
                  <input
                    type="text"
                    required
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    placeholder="e.g. Liam Parker"
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Assign Vacant Room</label>
                  <select
                    value={newTenant.unit}
                    required
                    onChange={(e) => setNewTenant({ ...newTenant, unit: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  >
                    <option value="">Choose Unit...</option>
                    {rooms.filter(rm => rm.status === 'Vacant').map(rm => (
                      <option key={rm.id} value={rm.number}>{rm.number} (${rm.monthlyRent}/m)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  placeholder="liam.p@gmail.com"
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  placeholder="555-9121"
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Lease Start</label>
                  <input
                    type="date"
                    value={newTenant.leaseStart}
                    onChange={(e) => setNewTenant({ ...newTenant, leaseStart: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Lease End</label>
                  <input
                    type="date"
                    value={newTenant.leaseEnd}
                    onChange={(e) => setNewTenant({ ...newTenant, leaseEnd: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsTenantModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-2.5 text-xs font-bold text-white shadow"
                >
                  Confirm Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
