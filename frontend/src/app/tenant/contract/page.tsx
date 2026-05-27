"use client";

import React, { useState } from 'react';
import { FileText, ShieldCheck, Download, ExternalLink, Info } from 'lucide-react';
import { ContractOverview } from '@/components/tenant/ContractOverview';

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
        {/* Core details extracted to component */}
        <ContractOverview />

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
