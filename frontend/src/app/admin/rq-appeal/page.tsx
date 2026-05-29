"use client";

import React, { useState, useContext, useMemo } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { 
  Search, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Calendar,
  X,
  Phone,
  ArrowRight
} from 'lucide-react';

export default function AdminRqAppealPage() {
  const context = useContext(AdminContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Review' | 'Resolved'>('All');

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { appeals, updateAppealStatus } = context;

  // Filtered appeals
  const filteredAppeals = useMemo(() => {
    return appeals.filter(apl => {
      const matchesSearch = apl.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            apl.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            apl.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || apl.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appeals, searchTerm, statusFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">บันทึกข้อร้องเรียน</h1>
        <p className="text-slate-500 text-sm font-semibold">ติดตามความคิดเห็นของผู้เช่า ประสานงานการไกล่เกลี่ย และแก้ไขปัญหาข้อร้องเรียน</p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="relative md:col-span-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อผู้เช่า ประเภท หรือคำสำคัญ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] transition-all shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-4 flex rounded-2xl border border-[#FFC193]/50 bg-white p-1 shadow-sm">
          {(['All', 'Pending', 'In Review', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                statusFilter === tab
                  ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#FF3737]'
              }`}
            >
              {tab === 'All' ? 'ทั้งหมด' : tab === 'Pending' ? 'รอดำเนินการ' : tab === 'In Review' ? 'กำลังตรวจสอบ' : 'แก้ไขแล้ว'}
            </button>
          ))}
        </div>
      </div>

      {/* Appeals List */}
      <div className="space-y-4">
        {filteredAppeals.map(apl => (
          <div 
            key={apl.id} 
            className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">{apl.complainantName}</span>
                
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                  apl.status === 'Resolved' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : apl.status === 'In Review' 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {apl.status === 'Resolved' ? 'แก้ไขแล้ว' : apl.status === 'In Review' ? 'กำลังตรวจสอบ' : 'รอดำเนินการ'}
                </span>
              </div>
              
              <h4 className="text-xs font-black text-[#FF3737] uppercase tracking-wider">{apl.category}</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{apl.details}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  วันที่ยื่น: {apl.date}
                </span>
                
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  ติดต่อ: {apl.contactNumber}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {apl.status === 'Pending' && (
                <button
                  onClick={() => updateAppealStatus(apl.id, 'In Review')}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white px-4 py-2.5 text-xs font-bold shadow hover:brightness-105"
                >
                  <span>ตรวจสอบ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {apl.status === 'In Review' && (
                <button
                  onClick={() => updateAppealStatus(apl.id, 'Resolved')}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2.5 text-xs font-bold shadow hover:brightness-105"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>แก้ไขข้อร้องเรียน</span>
                </button>
              )}
              {apl.status === 'Resolved' && (
                <button
                  onClick={() => updateAppealStatus(apl.id, 'In Review')}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  เปิดเรื่องอีกครั้ง
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredAppeals.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#FFC193]/30">
            <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-400 text-sm">ไม่มีข้อร้องเรียนที่บันทึกไว้</p>
          </div>
        )}
      </div>
    </div>
  );
}
