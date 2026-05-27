import React from 'react';
import { Invoice } from '@/types/tenant';
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
  ChevronDown,
  ChevronUp
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
  const details = resolveInvoiceDetails(inv);

  return (
    <div
      className="rounded-2xl border border-[#FFC193]/35 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-[#FF8383]/45 transition-all duration-200"
    >
      {/* Card Main Row */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-black text-slate-900">{inv.month}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${inv.status === 'Paid'
                ? 'bg-[#FFC193]/20 text-[#FF3737] border-[#FFC193]/40'
                : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>{inv.status}</span>
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
              className="flex items-center gap-1 text-xs font-black text-[#FF3737] hover:text-[#FF8383] transition-colors focus:outline-none"
            >
              <span>{isExpanded ? 'Hide details' : 'More detail'}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="block text-[9px] uppercase font-black tracking-wider text-slate-400">Total Charge</span>
            <span className="text-2xl font-black text-slate-900">฿{inv.amount.toLocaleString('en-US')}</span>
          </div>

          {inv.status !== 'Paid' ? (
            <button
              onClick={() => onPay(inv.id, inv.month)}
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

      {/* Collapsible Details Drawer */}
      {isExpanded && (
        <div className="border-t border-[#FFC193]/20 bg-gradient-to-b from-[#FFFDF9]/40 to-white/80 p-6 space-y-6 animate-fadeIn">
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
            
            <button
              onClick={() => handlePrint(inv)}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold tracking-wide transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-sm hover:border-[#FFC193]/60 focus:outline-none"
            >
              <Printer className="h-4 w-4" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
