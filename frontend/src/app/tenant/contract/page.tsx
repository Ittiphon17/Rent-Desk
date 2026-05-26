"use client";

import React, { useState } from 'react';
import { FileText, Calendar, ShieldCheck, Download, ExternalLink, Sparkles, Building, Info } from 'lucide-react';

export default function ContractPage() {
  const [downloading, setDownloading] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Mock PDF Contract downloaded successfully!');
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl w-full mx-auto animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <FileText className="h-8 w-8 text-[#FF3737]" />
          <span>Lease Agreement</span>
        </h1>
        <p className="text-slate-550 text-sm font-semibold mt-1">Review the legal details and terms of your residential lease agreement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core details */}
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
                <span><strong>Trash Disposal:</strong> Trash bags must be securely tied and deposited inside designated chute areas on each floor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
                <span><strong>Pets Policy:</strong> Only small domestic pets are allowed, subject to the registered pet addendum and deposit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
                <span><strong>Guest Policy:</strong> Guests staying longer than 14 consecutive days require written management approval.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-6">
          {/* Status badge */}
          <div className="rounded-2xl border border-[#FFC193]/35 bg-white p-5 shadow-sm space-y-3.5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <ShieldCheck className="h-6.5 w-6.5" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-800">Lease Status: Active</span>
              <p className="text-[10px] text-slate-450 font-semibold mt-1">Verified & Digitally Signed</p>
            </div>
            
            <button
              onClick={triggerDownload}
              disabled={downloading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] hover:brightness-105 transition-all text-white font-bold text-xs py-3 shadow-md shadow-[#FF3737]/15 flex items-center justify-center gap-2"
            >
              <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Preparing PDF...' : 'Download Signed PDF'}</span>
            </button>
          </div>

          {/* Help box */}
          <div className="rounded-2xl bg-white/70 border border-[#FFC193]/30 p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[#FF3737]" />
              <span>Contract Inquiries</span>
            </h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Need to request early termination, lease extension, or add an occupant to the contract? Submit an official query directly to the landlord desk.
            </p>
            <button
              onClick={() => alert('Lease inquiry submission is simulated!')}
              className="text-xs font-extrabold text-[#FF3737] hover:text-[#FF8383] transition-colors flex items-center gap-1 mt-1"
            >
              <span>Contact Landlord Desk</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
