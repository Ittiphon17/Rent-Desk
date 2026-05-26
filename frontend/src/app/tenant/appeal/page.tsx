"use client";

import React, { useState } from 'react';
import { useTenant } from '../layout';
import { MessageSquare, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, User, Phone } from 'lucide-react';

export default function AppealPage() {
  const { appeals, addAppeal } = useTenant();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Noise Complaint');
  const [details, setDetails] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) return;

    addAppeal(name, phone, category, details);

    // Reset Form
    setName('');
    setPhone('');
    setDetails('');
    setSuccessMsg('Complaint filed successfully. The property management desk has been notified.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-[#FF3737]" />
          <span>Complaint & Appeals</span>
        </h1>
        <p className="text-slate-555 text-sm font-semibold mt-1">Submit concerns, neighborhood disputes, or operational grievances directly to management.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-bold text-sm shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">New Grievance File</h3>
          
          {/* Complainant Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Complainant Name</label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Contact Number</label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number (e.g. 081-XXX-XXXX)"
                className="block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-[#FF3737] focus:bg-white transition-all"
            >
              <option value="Noise Complaint">Noise & Nuisance</option>
              <option value="Cleanliness">Cleanliness & Trash Disposal</option>
              <option value="Common Area">Common Area Maintenance</option>
              <option value="Property Rules">Violating Building Rules</option>
              <option value="Staff Behavior">Staff or Security Conduct</option>
              <option value="Other">Other Disputes</option>
            </select>
          </div>

          {/* Issue Details */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Brief details of the complaint</label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain the complaint clearly, listing dates/times and specific units involved if applicable..."
              rows={4}
              className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-3 text-xs font-black uppercase tracking-wider text-white shadow hover:brightness-105 transition-all shadow-[#FF3737]/15 hover:shadow-[#FF3737]/25"
          >
            Submit Appeal
          </button>
        </form>

        {/* Status Feed */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b pb-2">
            <Sparkles className="h-4 w-4 text-[#FF3737]" />
            <span>Appeal History</span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {appeals.map(apl => (
              <div key={apl.id} className="rounded-2xl border border-[#FFC193]/35 bg-white p-4.5 shadow-sm space-y-3.5 hover:border-[#FF8383]/45 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#FF3737] uppercase">{apl.category}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase border ${
                    apl.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800 border-emerald-250' :
                    apl.status === 'In Review' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    'bg-slate-50 text-slate-550 border border-slate-200'
                  }`}>{apl.status}</span>
                </div>

                <p className="text-xs font-semibold text-slate-750 leading-relaxed whitespace-pre-line">{apl.details}</p>

                <div className="pt-2 border-t border-slate-50 space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Filed By: {apl.complainantName}</span>
                    <span>Phone: {apl.contactNumber}</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 text-right">
                    <span>Filed On: {apl.date}</span>
                  </div>
                </div>
              </div>
            ))}

            {appeals.length === 0 && (
              <p className="text-center py-12 text-xs text-slate-400 font-semibold bg-white/50 border border-[#FFC193]/35 rounded-2xl p-6">
                No active complaints filed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
