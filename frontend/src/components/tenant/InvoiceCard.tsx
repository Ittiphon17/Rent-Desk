'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Invoice } from '@/types/tenant';
import { useTenant } from '@/hooks/useTenant';
import { PaymentModal } from './PaymentModal';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Sparkles,
  User,
  Home,
  Clock,
  Printer,
  FileText,
  ChevronDown
} from 'lucide-react';
import { resolveInvoiceDetails, handlePrint } from '@/lib/invoice-utils';

interface InvoiceCardProps {
  inv: Invoice;
  isExpanded: boolean;
  onToggleDetails: () => void;
  onPay: (id: string, month: string) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  inv,
  isExpanded,
  onToggleDetails,
  onPay
}) => {
  const { submitInvoiceSlip, approveInvoice } = useTenant();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const details = resolveInvoiceDetails(inv);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, inv]);

  const getStatusBadge = () => {
    switch (inv.status) {
      case 'Settled':
      case 'Paid':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-250 animate-fadeIn shadow-sm flex items-center gap-1">
            <span>Settled</span>
          </span>
        );
      case 'Verificata':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border bg-amber-55/15 text-amber-700 border-amber-250/60 animate-pulse shadow-sm flex items-center gap-1">
            <span>Verificata</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border bg-rose-50 text-rose-700 border-rose-200 shadow-sm flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-rose-500"></span>
            <span>Overdue</span>
          </span>
        );
      case 'Unpaid':
      default:
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border bg-[#FFC193]/20 text-[#FF3737] border-[#FFC193]/40 shadow-sm flex items-center gap-1">
            {/* <span className="h-1 w-1 rounded-full bg-[#FF3737]"></span> */}
            <span className="h-1 w-1 rounded-full bg-amber-500 animate-ping"></span>
            <span>Unpaid</span>
          </span>
        );
    }
  };

  const renderActions = () => {
    if (inv.status === 'Settled' || inv.status === 'Paid') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-150 shadow-sm animate-fadeIn">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
          <span>Settled</span>
        </div>
      );
    }

    if (inv.status === 'Verificata') {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {/* Waiting label */}
          <div className="flex items-center gap-2 text-xs font-black text-amber-700 bg-amber-50 px-3.5 py-3 rounded-xl border border-amber-150 shadow-sm select-none">
            <span>Waiting Check</span>
          </div>

          {/* Simulated admin approval button */}
          <button
            onClick={() => approveInvoice(inv.id)}
            className="rounded-xl bg-[#2C1A1A] hover:bg-slate-800 text-white px-4 py-3 text-xs font-black tracking-wide shadow-md hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] transition-all flex items-center gap-1.5 focus:outline-none"
            title="Simulate Admin checking and approving this payment slip"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FFC193]" />
            <span>Verify (Demo)</span>
          </button>
        </div>
      );
    }

    // Default: Unpaid or Overdue
    return (
      <button
        onClick={() => setShowPaymentModal(true)}
        className="rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-5 py-3 text-xs font-black tracking-wide shadow-lg shadow-[#FF3737]/15 transition-all hover:brightness-105 active:scale-[0.98] flex items-center gap-2 hover:shadow-[#FF3737]/30 focus:outline-none"
      >
        <CreditCard className="h-4 w-4" />
        <span>Pay Bill Now</span>
      </button>
    );
  };

  return (
    <div
      className="rounded-2xl border border-[#FFC193]/35 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-[#FF8383]/45 transition-all duration-200"
    >
      {/* Card Main Row */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-black text-slate-900">{inv.month}</span>
            {getStatusBadge()}
          </div>

          <p className="text-xs text-slate-400 font-bold">
            Reference ID: <span className="font-mono text-[#FF3737]">{inv.id}</span>
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Due Date: {inv.dueDate}</span>
            </div>

            <button
              onClick={onToggleDetails}
              className="flex items-center gap-1 text-xs font-black text-[#FF3737] hover:text-[#FF8383] transition-colors focus:outline-none group"
            >
              <span>{isExpanded ? 'Hide details' : 'More detail'}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="block text-[9px] uppercase font-black tracking-wider text-slate-400">Total Charge</span>
            <span className="text-2xl font-black text-slate-900">฿{inv.amount.toLocaleString('en-US')}</span>
          </div>

          {renderActions()}
        </div>
      </div>

      {/* Collapsible Details Drawer */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className={`border-t border-[#FFC193]/20 bg-gradient-to-b from-[#FFFDF9]/40 to-white/80 p-6 space-y-6 transition-transform duration-400 ease-in-out ${isExpanded ? 'translate-y-0' : '-translate-y-2'
            }`}
        >
          {/* Detailed Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-[#FFEDCE]/15 p-4 rounded-xl border border-[#FFC193]/20 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2.5">
              <User className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Tenant Name</span>
                <span className="font-bold text-slate-800">{details.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Home className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Room</span>
                <span className="font-bold text-slate-800">Room {details.room}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Service Period</span>
                <span className="font-bold text-slate-800">{details.startDate} - {details.endDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:col-span-2 md:col-span-1">
              <Clock className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Billing Date</span>
                <span className="font-bold text-slate-800">{details.invoiceDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:col-span-2 md:col-span-2">
              <FileText className="h-4.5 w-4.5 text-[#FF3737] shrink-0" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Reference ID</span>
                <span className="font-mono font-bold text-[#FF3737]">{inv.id}</span>
              </div>
            </div>
          </div>

          {/* Table Detail */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-[#FFFDF9] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center w-12">No</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3 text-center w-24">Quantity</th>
                  <th scope="col" className="px-4 py-3 text-right w-32">Price (THB)</th>
                  <th scope="col" className="px-4 py-3 text-right w-32">Total (THB)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
                {details.items.map((item: any) => (
                  <tr key={item.no} className="hover:bg-[#FFFDF9]/40 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-400">{item.no}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.item}</td>
                    <td className="px-4 py-3 text-center font-black">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-650">{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}

                {/* Summary Row */}
                <tr className="bg-[#FFEDCE]/10 font-bold">
                  <td colSpan={3} className="px-4 py-4 text-slate-500 italic font-semibold border-t border-[#FFC193]/35 text-xxs sm:text-xs">
                    {details.amountWords}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-500 border-t border-[#FFC193]/35">
                    Net Amount
                  </td>
                  <td className="px-4 py-4 text-right text-lg font-black text-[#FF3737] font-mono border-t border-[#FFC193]/35">
                    ฿{inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions inside Details */}
          <div className="flex justify-between items-center gap-4 pt-2">
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#FF8383]" />
              <span>Official digital invoice generated by RentDesk.</span>
            </p>

            <div className="flex items-center gap-2">
              {inv.slipImage && (
                <a
                  href={inv.slipImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2.5 text-xs font-bold tracking-wide transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>View Attached Slip</span>
                </a>
              )}
              <button
                onClick={() => handlePrint(inv)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold tracking-wide transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-sm hover:border-[#FFC193]/60 focus:outline-none"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          inv={inv}
          onClose={() => setShowPaymentModal(false)}
          onSubmitSlip={(id, slip) => {
            submitInvoiceSlip(id, slip);
            onPay(id, inv.month); // Triggers visual toast on success msg in page
          }}
        />
      )}
    </div>
  );
};
