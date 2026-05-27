import React from 'react';
import { Building, Calendar } from 'lucide-react';

export const ContractOverview: React.FC = () => {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">Contract Overview</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Property Name</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-1">
              <Building className="h-4 w-4 text-[#FF8383]" />
              RentDesk Condos
            </span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Assigned Unit</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">B-101 (1-Bedroom)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Lease Term</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">12 Months (Fixed Term)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Security Deposit</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">$2,200.00 (Fully Paid)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Monthly Base Rent</span>
            <span className="text-lg font-black text-[#FF3737] mt-0.5 block">$1,500.00</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Payment Due Date</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">Before the 5th of every month.</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <span className="block text-[9px] uppercase font-black text-slate-400">Lease Commencement</span>
              <span className="text-xs font-bold text-slate-700">01 June 2025</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#FF8383] shrink-0" />
            <div>
              <span className="block text-[9px] uppercase font-black text-slate-400">Lease Expiration</span>
              <span className="text-xs font-bold text-slate-700">31 May 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">Complex Rules & Guidelines</h3>

        <ul className="space-y-2.5 text-xs text-slate-650 font-semibold leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>Rent Payment:</strong> The rent bill will be calculated on the 25th of every month, and the tenant must pay rent no later than the 5th of every month; otherwise, a penalty of $100 per day will be charged until the rent is overdue.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>Quiet Hours:</strong> Strictly enforced from 10:00 PM to 7:00 AM daily to guarantee tranquility for all residents.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>Pets Policy:</strong> Only small domestic pets are allowed, subject to the registered pet addendum and deposit.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
