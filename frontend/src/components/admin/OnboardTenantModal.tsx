import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Room } from '@/types/admin';
import { translateRoomType } from '@/lib/translate';

interface OnboardTenantModalProps {
  rooms: Room[];
  onClose: () => void;
  onSubmit: (tenantData: {
    name: string;
    unit: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  }) => void;
}

export const OnboardTenantModal: React.FC<OnboardTenantModalProps> = ({
  rooms,
  onClose,
  onSubmit
}) => {
  const [tenantData, setTenantData] = useState({
    name: '',
    unit: '',
    email: '',
    phone: '',
    leaseStart: '',
    leaseEnd: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantData.name.trim() || !tenantData.unit) return;

    onSubmit(tenantData);

    // Reset Form
    setTenantData({
      name: '',
      unit: '',
      email: '',
      phone: '',
      leaseStart: '',
      leaseEnd: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#FFC193]/50 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-150 p-5 bg-[#FFEDCE]/30">
          <h3 className="text-base font-bold text-slate-900">ลงทะเบียนผู้เช่า</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="h-5.5 w-5.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล ผู้เช่า</label>
              <input
                type="text"
                required
                value={tenantData.name}
                onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
                placeholder="เช่น สมชาย ใจดี"
                className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">เลือกห้องว่าง</label>
              <select
                value={tenantData.unit}
                required
                onChange={(e) => setTenantData({ ...tenantData, unit: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
              >
                <option value="">เลือกห้อง...</option>
                {rooms.filter(rm => rm.status === 'Vacant').map(rm => (
                  <option key={rm.id} value={rm.number}>{rm.number} (฿{rm.monthlyRent}/เดือน - {translateRoomType(rm.type)})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">ที่อยู่อีเมล</label>
            <input
              type="email"
              value={tenantData.email}
              onChange={(e) => setTenantData({ ...tenantData, email: e.target.value })}
              placeholder="somchai.j@gmail.com"
              className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={tenantData.phone}
              onChange={(e) => setTenantData({ ...tenantData, phone: e.target.value })}
              placeholder="081-234-5678"
              className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">วันเริ่มต้นสัญญา</label>
              <input
                type="date"
                value={tenantData.leaseStart}
                onChange={(e) => setTenantData({ ...tenantData, leaseStart: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">วันสิ้นสุดสัญญา</label>
              <input
                type="date"
                value={tenantData.leaseEnd}
                onChange={(e) => setTenantData({ ...tenantData, leaseEnd: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-2.5 text-xs font-bold text-white shadow"
            >
              ยืนยันการลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
