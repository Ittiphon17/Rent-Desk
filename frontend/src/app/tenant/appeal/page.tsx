"use client";

import React, { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { AppealForm } from '@/components/tenant/AppealForm';
import { AppealFeed } from '@/components/tenant/AppealFeed';
import { MessageSquare, CheckCircle2 } from 'lucide-react';

export default function AppealPage() {
  const { appeals, addAppeal } = useTenant();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (name: string, phone: string, category: string, details: string) => {
    addAppeal(name, phone, category, details);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <AppealForm onSubmit={handleSubmit} />

        {/* Status Feed */}
        <AppealFeed appeals={appeals} />
      </div>
    </div>
  );
}
