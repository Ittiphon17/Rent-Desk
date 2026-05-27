"use client";

import React, { useState, useContext, useMemo } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { 
  Search, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Calendar,
  Layers,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { AdminMaintenanceTicket } from '@/types/admin';

export default function AdminRqMaintenancePage() {
  const context = useContext(AdminContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { tickets, advanceTicketStatus, updateTicketStatus } = context;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(tkt => {
      const matchesSearch = tkt.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tkt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tkt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tkt.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || tkt.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Repair Inbox</h1>
        <p className="text-slate-500 text-sm font-semibold">Assign tasks, inspect tenant uploads, and resolve unit maintenance request logs.</p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="relative md:col-span-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by Room Unit or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] transition-all shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 flex rounded-2xl border border-[#FFC193]/50 bg-white p-1 shadow-sm">
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${
                statusFilter === tab
                  ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#FF3737]'
              }`}
            >
              {tab === 'In Progress' ? 'Pending' : tab}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-3 flex rounded-2xl border border-[#FFC193]/50 bg-white p-1 shadow-sm">
          {(['All', 'Low', 'Medium', 'High'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setPriorityFilter(tab)}
              className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${
                priorityFilter === tab
                  ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#FF3737]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map(tkt => {
          // Check if there are images stored (tenant ticket)
          const hasImages = (tkt as any).images && (tkt as any).images.length > 0;
          const firstImage = hasImages ? (tkt as any).images[0] : null;

          return (
            <div 
              key={tkt.id} 
              className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 font-mono">Room Unit {tkt.unit}</span>
                  
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    tkt.priority === 'High' 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : tkt.priority === 'Medium' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {tkt.priority} priority
                  </span>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                    tkt.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800' :
                    tkt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {tkt.status === 'In Progress' ? 'In Progress' : tkt.status}
                  </span>
                </div>
                
                <h4 className="text-xs font-black text-[#FF3737] uppercase tracking-wider">{tkt.category}</h4>
                <p className="text-sm text-slate-700 font-medium">{tkt.description}</p>
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Filed: {tkt.date}
                  </span>

                  {hasImages && (
                    <button 
                      onClick={() => setViewingImage(firstImage)}
                      className="flex items-center gap-1 text-[#FF3737] hover:underline"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      View Resident Photo Attachment
                    </button>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {tkt.status === 'Open' && (
                  <button
                    onClick={() => advanceTicketStatus(tkt.id)}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white px-4 py-2.5 text-xs font-bold shadow hover:brightness-105"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Begin Work</span>
                  </button>
                )}
                {tkt.status === 'In Progress' && (
                  <button
                    onClick={() => advanceTicketStatus(tkt.id)}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2.5 text-xs font-bold shadow hover:brightness-105"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Complete / Resolve</span>
                  </button>
                )}
                {tkt.status === 'Resolved' && (
                  <button
                    onClick={() => updateTicketStatus(tkt.id, 'In Progress')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#FFC193]/30">
            <Wrench className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-400 text-sm">No maintenance requests found.</p>
          </div>
        )}
      </div>

      {/* Image Viewer Lightbox */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img 
              src={viewingImage} 
              alt="Repair Request Upload" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tenant Attachment Preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
