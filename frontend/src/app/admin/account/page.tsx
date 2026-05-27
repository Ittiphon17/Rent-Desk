"use client";

import React, { useState, useContext, useMemo } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { AdminInvoice } from '@/types/admin';
import { 
  Download, 
  Printer, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  Eye, 
  X,
  FileCheck,
  Search
} from 'lucide-react';

export default function AdminAccountPage() {
  const context = useContext(AdminContext);
  
  // States
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('All');
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeSlip, setActiveSlip] = useState<string | null>(null);

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { invoices, updateInvoiceStatus } = context;

  // Extract unique months sorted
  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    invoices.forEach(inv => {
      // Month format example: "June 2026", "May 2026", or fallback from dueDate
      if (inv.month) {
        months.add(inv.month);
      } else {
        const date = new Date(inv.dueDate);
        if (!isNaN(date.getTime())) {
          months.add(date.toLocaleString('th-TH', { month: 'long', year: 'numeric' }));
        }
      }
    });
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime(); // Descending (latest first)
    });
  }, [invoices]);

  // Filter invoices by month range and search term and status
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Month calculation
      const invMonth = inv.month || new Date(inv.dueDate).toLocaleString('th-TH', { month: 'long', year: 'numeric' });
      
      let passMonth = true;
      if (selectedStartMonth !== 'All' || selectedEndMonth !== 'All') {
        const dateInv = new Date(invMonth);
        
        if (selectedStartMonth !== 'All') {
          const dateStart = new Date(selectedStartMonth);
          if (dateInv < dateStart) passMonth = false;
        }
        
        if (selectedEndMonth !== 'All') {
          const dateEnd = new Date(selectedEndMonth);
          if (dateInv > dateEnd) passMonth = false;
        }
      }

      // Search term
      const passSearch = inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.unit.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const passStatus = statusFilter === 'All' || inv.status === statusFilter;

      return passMonth && passSearch && passStatus;
    });
  }, [invoices, selectedStartMonth, selectedEndMonth, searchTerm, statusFilter]);

  // Calculated Metrics
  const metrics = useMemo(() => {
    let collected = 0;
    let pending = 0;
    let verifiedWaiting = 0;
    let total = 0;

    filteredInvoices.forEach(inv => {
      total += inv.amount;
      if (inv.status === 'Paid' || inv.status === 'Settled') {
        collected += inv.amount;
      } else if (inv.status === 'Verificata') {
        verifiedWaiting += inv.amount;
      } else {
        pending += inv.amount;
      }
    });

    return { collected, pending, verifiedWaiting, total };
  }, [filteredInvoices]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      alert("ไม่มีข้อมูลสำหรับส่งออก");
      return;
    }

    const headers = ["รหัสใบแจ้งหนี้", "ชื่อผู้เช่า", "หมายเลขห้อง", "จำนวนเงิน", "วันครบกำหนด", "สถานะ", "รอบบิล"];
    const rows = filteredInvoices.map(inv => [
      inv.id,
      inv.tenantName,
      inv.unit,
      inv.amount.toString(),
      inv.dueDate,
      inv.status,
      inv.month || new Date(inv.dueDate).toLocaleString('th-TH', { month: 'long', year: 'numeric' })
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rentdesk_revenue_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto animate-fadeIn print:bg-white print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900">บัญชีและการเรียกเก็บเงิน</h1>
          <p className="text-slate-500 text-sm font-semibold">ติดตามรายรับของอาคาร ตรวจสอบการโอนเงิน และดาวน์โหลดรายงาน</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#FFC193]/60 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>พิมพ์รายงาน</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] px-4.5 py-3 text-xs font-bold text-white shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Download className="h-4 w-4" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        {/* Start Month */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#FF3737]" /> เดือนเริ่มต้น
          </label>
          <select
            value={selectedStartMonth}
            onChange={(e) => setSelectedStartMonth(e.target.value)}
            className="w-full rounded-xl border border-[#FFC193]/50 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#FF3737]"
          >
            <option value="All">เดือนแรกที่มี</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* End Month */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#FF3737]" /> เดือนสิ้นสุด
          </label>
          <select
            value={selectedEndMonth}
            onChange={(e) => setSelectedEndMonth(e.target.value)}
            className="w-full rounded-xl border border-[#FFC193]/50 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#FF3737]"
          >
            <option value="All">เดือนล่าสุดที่มี</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">สถานะ</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-[#FFC193]/50 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#FF3737]"
          >
            <option value="All">ใบแจ้งหนี้ทั้งหมด</option>
            <option value="Paid">ชำระแล้ว</option>
            <option value="Settled">เสร็จสิ้น (ตรวจสอบแล้ว)</option>
            <option value="Verificata">รอตรวจสอบ (ส่งสลิปแล้ว)</option>
            <option value="Unpaid">ยังไม่ชำระ</option>
            <option value="Overdue">ค้างชำระ</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">ค้นหาผู้เช่า/ห้อง</label>
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#FFC193]/50 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#FF3737]"
            />
            <Search className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Revenue Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Billed */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">ยอดเรียกเก็บทั้งหมด</span>
            <DollarSign className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">฿{metrics.total}</div>
          <span className="block text-[9px] text-slate-400 font-bold mt-1">รวมยอดตามช่วงที่เลือก</span>
        </div>

        {/* Total Collected */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-emerald-50/50 p-5 border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">รายรับรวม</span>
            <CheckCircle className="h-4.5 w-4.5" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-800 font-mono">฿{metrics.collected}</div>
          <span className="block text-[9px] text-emerald-600 font-bold mt-1">ชำระแล้ว / เสร็จสิ้น</span>
        </div>

        {/* Verified Waiting Approval */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-indigo-50/50 p-5 border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">รอตรวจสอบ</span>
            <FileCheck className="h-4.5 w-4.5" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-800 font-mono">฿{metrics.verifiedWaiting}</div>
          <span className="block text-[9px] text-indigo-600 font-bold mt-1">สลิปรอการตรวจ</span>
        </div>

        {/* Total Pending Payments */}
        <div className="rounded-2xl border border-[#FFC193]/30 bg-rose-50/50 p-5 border-rose-100 shadow-sm">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">รอการชำระ</span>
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-800 font-mono">฿{metrics.pending}</div>
          <span className="block text-[9px] text-rose-600 font-bold mt-1">ยังไม่ชำระ & ค้างชำระ</span>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm print:border-none print:shadow-none">
        <div className="p-5 border-b border-[#FFC193]/15 flex items-center justify-between print:hidden">
          <h3 className="font-bold text-slate-900 text-sm">บัญชีใบแจ้งหนี้</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">กรองแล้ว {filteredInvoices.length} รายการ</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#FFEDCE]/40 text-xs font-bold uppercase tracking-wider text-[#FF3737] border-b border-[#FFC193]/20">
              <tr>
                <th className="px-6 py-4">ผู้เช่า</th>
                <th className="px-6 py-4">หมายเลขห้อง</th>
                <th className="px-6 py-4">เดือน</th>
                <th className="px-6 py-4">จำนวนเงิน</th>
                <th className="px-6 py-4">วันครบกำหนด</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center print:hidden">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFC193]/20">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#FFEDCE]/10 transition-colors">
                    {/* Resident */}
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.tenantName}</td>
                    
                    {/* Room Unit */}
                    <td className="px-6 py-4 font-bold font-mono text-[#FF3737]">{inv.unit}</td>
                    
                    {/* Month */}
                    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">
                      {inv.month || new Date(inv.dueDate).toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-slate-800 font-mono">฿{inv.amount}</td>
                    
                    {/* Due Date */}
                    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{inv.dueDate}</td>
                    
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                        inv.status === 'Paid' || inv.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : inv.status === 'Verificata'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse'
                          : inv.status === 'Overdue'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {inv.status === 'Verificata' ? 'รอตรวจสอบ' : inv.status === 'Paid' ? 'ชำระแล้ว' : inv.status === 'Settled' ? 'เสร็จสิ้น' : inv.status === 'Overdue' ? 'ค้างชำระ' : 'ยังไม่ชำระ'}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td className="px-6 py-4 print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.status === 'Verificata' && inv.slipImage && (
                          <button
                            onClick={() => setActiveSlip(inv.slipImage || null)}
                            className="flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700"
                            title="Verify slip"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>ตรวจสลิป</span>
                          </button>
                        )}
                        
                        {inv.status === 'Verificata' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Settled')}
                            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-2.5 py-1.5 text-xs font-bold shadow hover:brightness-105"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>อนุมัติ</span>
                          </button>
                        )}
                        
                        {inv.status !== 'Verificata' && inv.status !== 'Settled' && inv.status !== 'Paid' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                            className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-700"
                          >
                            ทำเครื่องหมายชำระแล้ว
                          </button>
                        )}
                        
                        {(inv.status === 'Paid' || inv.status === 'Settled') && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Unpaid')}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-500"
                          >
                            ยกเลิกการชำระ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    ไม่พบรายการใบแจ้งหนี้ตามช่วงที่เลือก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Image Viewer Overlay */}
      {activeSlip && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveSlip(null)}
        >
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setActiveSlip(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img 
              src={activeSlip} 
              alt="Payment receipt slip transfer" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <h4 className="text-sm font-bold text-slate-800">ใบเสร็จที่ผู้เช่าอัปโหลด</h4>
              <p className="text-xs text-slate-400 mt-1">ตรวจสอบหมายเลขธุรกรรมและยอดเงินก่อนอนุมัติ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
