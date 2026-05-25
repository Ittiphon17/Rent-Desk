"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, 
  DollarSign, 
  Wrench, 
  LogOut, 
  User, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Home,
  Layers,
  Calendar,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  month: string;
}

interface Room {
  number: string;
  type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse';
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  monthlyRent: number;
}

interface MaintenanceTicket {
  id: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

const mockRooms: Room[] = [
  { number: 'A-101', type: 'Studio', status: 'Vacant', monthlyRent: 950 },
  { number: 'A-102', type: 'Studio', status: 'Vacant', monthlyRent: 950 },
  { number: 'B-108', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1100 },
  { number: 'A-205', type: '1-Bedroom', status: 'Occupied', monthlyRent: 1250 },
  { number: 'C-301', type: '2-Bedroom', status: 'Vacant', monthlyRent: 1600 },
  { number: 'A-402', type: '2-Bedroom', status: 'Occupied', monthlyRent: 1450 },
  { number: 'Penthouse-501', type: 'Penthouse', status: 'Maintenance', monthlyRent: 3200 }
];

export default function TenantPage() {
  const router = useRouter();
  const { user, logout, initialize, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'invoices' | 'rooms' | 'maintenance'>('invoices');

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'inv-101', amount: 1100, dueDate: '2026-06-01', status: 'Unpaid', month: 'June 2026' },
    { id: 'inv-100', amount: 1100, dueDate: '2026-05-01', status: 'Paid', month: 'May 2026' },
  ]);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    { id: 'tkt-1', category: 'HVAC', description: 'Air conditioner is blowing warm air.', priority: 'Medium', status: 'In Progress', date: '2026-05-20' }
  ]);

  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState<string | null>(null);

  const [searchRoomTerm, setSearchRoomTerm] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Verify RBAC
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_token_local') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_user') : null;
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'tenant') {
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

  const payInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    alert('Invoice payment was recorded successfully!');
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const added: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      category,
      description,
      priority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setTickets([added, ...tickets]);
    setDescription('');
    setNewTicketMessage('Maintenance ticket created! Tech dispatch on the way.');
    setTimeout(() => setNewTicketMessage(null), 5000);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(rm => 
      rm.number.toLowerCase().includes(searchRoomTerm.toLowerCase()) ||
      rm.type.toLowerCase().includes(searchRoomTerm.toLowerCase())
    );
  }, [rooms, searchRoomTerm]);

  return (
    <div className="flex min-h-screen bg-[#FFEDCE] text-[#2C1A1A] font-sans relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-[-15%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[#FF8383]/10 blur-3xl pointer-events-none"></div>

      {/* Sidebar - Premium Glassmorphic design */}
      <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-[#FFC193]/30 bg-white/60 backdrop-blur-md p-6 md:flex relative z-10">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white shadow-lg shadow-[#FF3737]/20">
              <Building2 className="h-6.5 w-6.5" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-[#FF8383] to-[#FF3737] bg-clip-text text-transparent">RentDesk</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">Resident Space</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'invoices', name: 'Rent Invoices', icon: DollarSign },
              { id: 'rooms', name: 'Explore Rooms', icon: Home },
              { id: 'maintenance', name: 'Report Repairs', icon: Wrench },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); }}
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

        {/* Profile */}
        <div className="space-y-4 rounded-2xl border border-[#FFC193]/40 bg-white/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEDCE] text-[#FF3737] font-bold">
              T
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800">{user?.username || 'Resident'}</span>
              <span className="block text-[9px] font-extrabold uppercase text-[#FF3737]">
                Resident Portal
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF8383]/45 bg-white py-2.5 text-xs font-bold text-[#FF3737] hover:bg-[#FF8383]/5 transition-colors"
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
            <span className="text-slate-400">Resident Space /</span>
            <span className="text-[#FF3737] capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="rounded-xl border border-[#FFC193]/65 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="invoices">My Bills</option>
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

        <div className="flex-1 p-6 md:p-8 space-y-8 max-w-4xl w-full mx-auto">
          
          {/* INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Rent Invoices</h1>
                <p className="text-slate-500 text-sm font-semibold">Verify monthly charges and execute instant digital payments.</p>
              </div>

              <div className="space-y-4">
                {invoices.map(inv => (
                  <div key={inv.id} className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{inv.month}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                          inv.status === 'Paid' ? 'bg-[#FFC193]/20 text-[#FF3737] border border-[#FFC193]/30' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>{inv.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">Reference ID: <span className="font-mono text-[#FF3737]">{inv.id}</span></p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>Due Date: {inv.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0 justify-between sm:justify-start">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Total Charge</span>
                        <span className="text-2xl font-black text-slate-900">${inv.amount}</span>
                      </div>

                      {inv.status !== 'Paid' ? (
                        <button
                          onClick={() => payInvoice(inv.id)}
                          className="rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-5 py-3 text-xs font-bold shadow-lg shadow-[#FF3737]/10 transition-all hover:brightness-105 active:scale-[0.98]"
                        >
                          Pay Bill Now
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                          <span>Settled</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROOM SEARCH */}
          {activeTab === 'rooms' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Explore Rooms</h1>
                <p className="text-slate-500 text-sm font-semibold">Search unoccupied rooms and suites available inside the complex.</p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Filter available rooms (e.g. Penthouse)..."
                  value={searchRoomTerm}
                  onChange={(e) => setSearchRoomTerm(e.target.value)}
                  className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredRooms.map(rm => (
                  <div key={rm.number} className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-slate-900">{rm.number}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          rm.status === 'Vacant' ? 'bg-[#FFC193]/20 text-[#FF3737] border border-[#FFC193]/35' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>{rm.status}</span>
                      </div>
                      <span className="block mt-1.5 text-xs font-semibold text-slate-400">{rm.type} Suite</span>
                      <span className="block mt-1 text-sm font-bold text-slate-800">${rm.monthlyRent}/month</span>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-slate-400">
                      <Info className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
                      <span className="text-[10px] font-bold">Contact leasing center for site tour.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPAIR REPORTING */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Repair Dispatch</h1>
                <p className="text-slate-500 text-sm font-semibold">Report apartment defects directly to our quick-response tech crew.</p>
              </div>

              {newTicketMessage && (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{newTicketMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Form */}
                <form onSubmit={handleAddTicket} className="lg:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF3737] border-b pb-2">New repair query</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-750 outline-none focus:border-[#FF3737]"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="HVAC">HVAC / Climate Control</option>
                      <option value="Appliance">Appliances</option>
                      <option value="Structural">Structural (Door/Locks)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Urgency level</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p as any)}
                          className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                            priority === p 
                              ? 'bg-[#FF3737] border-[#FF3737] text-white shadow shadow-[#FF3737]/20' 
                              : 'bg-slate-50 border-slate-200 text-slate-450 hover:text-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Issue Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain what needs fixing (e.g. bathroom plumbing leak)..."
                      rows={3}
                      className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-3 text-xs font-bold text-white shadow"
                  >
                    Submit Repair Ticket
                  </button>
                </form>

                {/* Status lists */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Repair Feed</h3>
                  
                  <div className="space-y-3.5">
                    {tickets.map(tkt => (
                      <div key={tkt.id} className="rounded-2xl border border-[#FFC193]/35 bg-white p-4 shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#FF3737] uppercase">{tkt.category}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${
                            tkt.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800' :
                            tkt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-slate-100 text-slate-500'
                          }`}>{tkt.status}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed">{tkt.description}</p>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-50">
                          <span>Priority: {tkt.priority}</span>
                          <span>Filed: {tkt.date}</span>
                        </div>
                      </div>
                    ))}
                    {tickets.length === 0 && (
                      <p className="text-center py-6 text-xs text-slate-400 font-semibold">No reported repair works.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
