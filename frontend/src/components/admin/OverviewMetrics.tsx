import React from 'react';
import { DollarSign, Clock, Users, Wrench } from 'lucide-react';

interface Stats {
  totalRentCollected: number;
  totalRentPending: number;
  occupiedCount: number;
  vacantCount: number;
  activeMaintenanceCount: number;
}

interface OverviewMetricsProps {
  stats: Stats;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ stats }) => {
  return (
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
  );
};
