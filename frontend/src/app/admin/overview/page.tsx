"use client";

import React, { useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AdminContext } from '@/context/AdminContext';
import { OverviewMetrics } from '@/components/admin/OverviewMetrics';
import { UrgentTasksBoard } from '@/components/admin/UrgentTasksBoard';
import { KeyRackStatus } from '@/components/admin/KeyRackStatus';
import { 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  Wrench, 
  Home, 
  Users, 
  ChevronRight, 
  Tags,
  DollarSign
} from 'lucide-react';

export default function AdminOverviewPage() {
  const router = useRouter();
  const context = useContext(AdminContext);

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { tenants, rooms, invoices, tickets, appeals } = context;

  const stats = useMemo(() => {
    const totalRentCollected = invoices
      .filter(inv => inv.status === 'Paid' || inv.status === 'Settled')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalRentPending = invoices
      .filter(inv => inv.status !== 'Paid' && inv.status !== 'Settled')
      .reduce((sum, inv) => sum + inv.amount, 0);

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

  // Complaint stats
  const complaintStats = useMemo(() => {
    const pending = appeals.filter(a => a.status === 'Pending').length;
    const inReview = appeals.filter(a => a.status === 'In Review').length;
    const resolved = appeals.filter(a => a.status === 'Resolved').length;
    const total = appeals.length;

    return { pending, inReview, resolved, total };
  }, [appeals]);

  // Repair stats
  const repairStats = useMemo(() => {
    const open = tickets.filter(t => t.status === 'Open').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const total = tickets.length;

    return { open, inProgress, resolved, total };
  }, [tickets]);

  // Average Rental Rates
  const rentalRates = useMemo(() => {
    const types = ['Studio', '1-Bedroom', '2-Bedroom', 'Penthouse'] as const;
    return types.map(type => {
      const typeRooms = rooms.filter(r => r.type === type);
      const count = typeRooms.length;
      const averageRate = count > 0 
        ? Math.round(typeRooms.reduce((sum, r) => sum + r.monthlyRent, 0) / count) 
        : 0;
      return { type, averageRate, count };
    });
  }, [rooms]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Console Board</h1>
          <p className="mt-1.5 text-sm text-slate-500 font-semibold">Manage leases, rent books, and tenant tickets in style.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#FFC193]/40 px-3.5 py-1.5 text-xs font-extrabold text-[#FF3737] w-max shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Live Sync Active
        </div>
      </div>

      {/* Metrics Widgets */}
      <OverviewMetrics stats={stats} />

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rental Rates Card */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tags className="h-4.5 w-4.5 text-[#FF3737]" />
                Rental Rates
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Averages</span>
            </div>
            
            <div className="space-y-3">
              {rentalRates.map(rate => (
                <div key={rate.type} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">{rate.type} ({rate.count})</span>
                  <span className="font-mono font-black text-[#FF3737] bg-[#FFEDCE]/50 px-2 py-1 rounded-lg">
                    ${rate.averageRate}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => router.push('/admin/rooms')}
            className="mt-5 w-full flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-[#FF3737] hover:text-[#FF8383] transition-colors pt-2 border-t border-slate-50"
          >
            Manage Rooms <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Repair Status Widget */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="h-4.5 w-4.5 text-[#FF3737]" />
                Repairs Queue
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {repairStats.open + repairStats.inProgress} Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-rose-700">{repairStats.open}</span>
                <span className="text-[9px] font-bold text-rose-500 uppercase">Open</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-amber-700">{repairStats.inProgress}</span>
                <span className="text-[9px] font-bold text-amber-600 uppercase">Pending</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-emerald-700">{repairStats.resolved}</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Closed</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/admin/rq-maintenance')}
            className="mt-5 w-full flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-[#FF3737] hover:text-[#FF8383] transition-colors pt-2 border-t border-slate-50"
          >
            Review Inbox <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Complaints/Appeals Widget */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-[#FF3737]" />
                Complaint Log
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {complaintStats.pending + complaintStats.inReview} Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-red-50 border border-red-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-red-700">{complaintStats.pending}</span>
                <span className="text-[9px] font-bold text-red-500 uppercase">New</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-indigo-700">{complaintStats.inReview}</span>
                <span className="text-[9px] font-bold text-indigo-600 uppercase">In Review</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                <span className="block text-lg font-black text-emerald-700">{complaintStats.resolved}</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Solved</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/admin/rq-appeal')}
            className="mt-5 w-full flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase text-[#FF3737] hover:text-[#FF8383] transition-colors pt-2 border-t border-slate-50"
          >
            View Complaints <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* Urgent Tasks & Key Rack Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <UrgentTasksBoard 
          tickets={tickets} 
          setActiveTab={() => router.push('/admin/rq-maintenance')} 
        />
        
        <KeyRackStatus 
          rooms={rooms} 
          setActiveTab={() => router.push('/admin/rooms')} 
        />
      </div>
    </div>
  );
}
