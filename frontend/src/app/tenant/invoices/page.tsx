"use client";

import React, { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { InvoiceCard } from '@/components/tenant/InvoiceCard';
import { DollarSign, CheckCircle2 } from 'lucide-react';

export default function InvoicesPage() {
  const { invoices, payInvoice } = useTenant();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});

  const handlePay = (id: string, month: string) => {
    payInvoice(id);
    setSuccessMsg(`Payment for ${month} has been successfully processed!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const toggleDetails = (id: string) => {
    setExpandedInvoices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 space-y-6 animate-fadeIn relative z-10">
      {/* Alert block */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 shadow-xl text-emerald-800 font-black animate-slideUp text-xs md:text-sm">
          <CheckCircle2 className="h-5.5 w-5.5 text-emerald-600 shrink-0 animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hero card overview */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9]/60 to-white/70 backdrop-blur-md p-6 md:p-8 border border-[#FFC193]/35 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3737]">Resident Space</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Rent Billing</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-md leading-relaxed">
            Monitor and pay your active rental invoices. Download or print authorized digital statements anytime.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-[#FFEDCE]/35 px-4.5 py-3.5 rounded-2xl border border-[#FFC193]/40">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm text-[#FF3737]">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">Next Due</span>
            <span className="text-sm font-extrabold text-slate-800">01 June 2026</span>
          </div>
        </div>
      </div>

      {/* Roster Listing */}
      <div className="space-y-4">
        {invoices.map(inv => (
          <InvoiceCard
            key={inv.id}
            inv={inv}
            isExpanded={!!expandedInvoices[inv.id]}
            onToggleDetails={() => toggleDetails(inv.id)}
            onPay={handlePay}
          />
        ))}

        {invoices.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#FFC193]/60 bg-white/50 p-12 text-center shadow-sm">
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">No Rent Invoices Issued</p>
          </div>
        )}
      </div>
    </div>
  );
}
