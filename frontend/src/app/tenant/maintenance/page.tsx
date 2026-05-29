"use client";

import React, { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { RepairForm } from '@/components/tenant/RepairForm';
import { RepairFeed } from '@/components/tenant/RepairFeed';
import { Wrench, CheckCircle2 } from 'lucide-react';

export default function MaintenancePage() {
  const { tickets, addTicket } = useTenant();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (category: string, priority: 'Low' | 'Medium' | 'High', description: string, images: string[]) => {
    addTicket(category, priority, description, images);
    setSuccessMsg('ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว! เจ้าหน้าที่ฝ่ายบำรุงรักษาจะติดต่อกลับหาคุณในไม่ช้า');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto animate-fadeIn relative z-10">
      {/* Alert toast notifications */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-emerald-250 bg-emerald-50 px-6 py-4 shadow-xl text-emerald-800 font-black animate-slideUp text-xs md:text-sm">
          <CheckCircle2 className="h-5.5 w-5.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Wrench className="h-8 w-8 text-[#FF3737]" />
          <span>แจ้งซ่อมบำรุง</span>
        </h1>
        <p className="text-slate-550 text-sm font-semibold mt-1">แจ้งรายละเอียดสิ่งชำรุดเสียหาย หรืออุปกรณ์ขัดข้องในห้องพักหรือส่วนกลางโดยตรงไปยังเจ้าหน้าที่ฝ่ายบำรุงรักษา</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <RepairForm onSubmit={handleSubmit} />

        {/* Status Feed */}
        <RepairFeed tickets={tickets} />
      </div>
    </div>
  );
}
