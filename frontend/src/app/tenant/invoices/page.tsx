"use client";

import React, { useState } from 'react';
import { useTenant } from '../layout';
import { Calendar, CheckCircle2, DollarSign, CreditCard, Sparkles } from 'lucide-react';

export default function InvoicesPage() {
  const { invoices, payInvoice } = useTenant();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePay = (id: string, month: string) => {
    payInvoice(id);
    setSuccessMsg(`Payment for ${month} has been successfully processed!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl w-full mx-auto animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-[#FF3737]" />
          <span>Rent Invoices</span>
        </h1>
        <p className="text-slate-550 text-sm font-semibold mt-1">Verify monthly charges and execute instant digital payments securely.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-bold text-sm shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Invoice list */}
      <div className="space-y-4">
        {invoices.map(inv => (
          <div 
            key={inv.id} 
            className="rounded-2xl border border-[#FFC193]/35 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md hover:border-[#FF8383]/45 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-black text-slate-900">{inv.month}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                  inv.status === 'Paid' 
                    ? 'bg-[#FFC193]/20 text-[#FF3737] border-[#FFC193]/40' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>{inv.status}</span>
              </div>
              
              <p className="text-xs text-slate-400 font-bold">
                Reference ID: <span className="font-mono text-[#FF3737]">{inv.id}</span>
              </p>
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Due Date: {inv.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-400">Total Charge</span>
                <span className="text-2xl font-black text-slate-900">${inv.amount}</span>
              </div>

              {inv.status !== 'Paid' ? (
                <button
                  onClick={() => handlePay(inv.id, inv.month)}
                  className="rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-5 py-3 text-xs font-black tracking-wide shadow-lg shadow-[#FF3737]/15 transition-all hover:brightness-105 active:scale-[0.98] flex items-center gap-2 hover:shadow-[#FF3737]/30"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay Bill Now</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-150 shadow-sm">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Settled</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {invoices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#FFC193]/30 p-6 text-slate-400 font-bold">
            No bills or invoices issued yet.
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl bg-white/70 border border-[#FFC193]/30 p-5 flex gap-4">
        <Sparkles className="h-6 w-6 text-[#FF3737] shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Auto-Pay & Digital Receipting</h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            All payments are processed securely. Your receipts will be generated automatically and can be accessed within the portal anytime. For billing disputes, contact the property administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
