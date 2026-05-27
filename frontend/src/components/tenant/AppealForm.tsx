import React, { useState } from 'react';
import { User, Phone } from 'lucide-react';

interface AppealFormProps {
  onSubmit: (name: string, phone: string, category: string, details: string) => void;
}

export const AppealForm: React.FC<AppealFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Noise Complaint');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) return;

    onSubmit(name, phone, category, details);

    // Reset Form
    setName('');
    setPhone('');
    setDetails('');
  };

  return (
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
  );
};
