"use client";

import React, { useState, useContext, useMemo } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { OnboardTenantModal } from '@/components/admin/OnboardTenantModal';
import { translateStatus, translateRoomType } from '@/lib/translate';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Mail,
  Phone,
  UserPlus,
  X,
  UserCheck
} from 'lucide-react';
import { Tenant } from '@/types/admin';

export default function AdminTenantsPage() {
  const context = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { tenants, rooms, addTenant, editTenant, removeTenant } = context;

  // Filter tenants based on search term (name, room unit, or room details)
  const filteredTenants = useMemo(() => {
    return tenants.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tenants, searchTerm]);

  const handleEvict = (id: string, unit: string, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการยุติสัญญาเช่าของ ${name} ในห้อง ${unit}? การดำเนินการนี้จะย้ายผู้เช่าออกและเปลี่ยนสถานะห้องกลับเป็น "ว่าง"`)) {
      removeTenant(id, unit);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    editTenant(editingTenant.id, {
      name: editingTenant.name,
      unit: editingTenant.unit,
      email: editingTenant.email,
      phone: editingTenant.phone,
      leaseStart: editingTenant.leaseStart,
      leaseEnd: editingTenant.leaseEnd,
      status: editingTenant.status
    });

    setEditingTenant(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">รายชื่อผู้เช่า</h1>
          <p className="text-slate-500 text-sm font-semibold">ติดตามสัญญาเช่าที่ใช้งานอยู่ ลงทะเบียนผู้เช่าใหม่ และจัดการประวัติการเข้าพัก</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>ลงทะเบียนผู้เช่าใหม่</span>
        </button>
      </div>

      {/* Search Field */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาด้วยหมายเลขห้องหรือชื่อผู้เช่า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] transition-all shadow-sm"
        />
      </div>

      {/* Tenants Table */}
      <div className="overflow-hidden rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#FFEDCE]/40 text-xs font-bold uppercase tracking-wider text-[#FF3737] border-b border-[#FFC193]/20">
              <tr>
                <th className="px-6 py-4">ชื่อ</th>
                <th className="px-6 py-4">เลขห้อง</th>
                <th className="px-6 py-4">ข้อมูลติดต่อ</th>
                <th className="px-6 py-4">ระยะเวลาสัญญา</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFC193]/20">
              {filteredTenants.length > 0 ? (
                filteredTenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-[#FFEDCE]/10 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{tenant.name}</div>
                      <span className={`inline-flex items-center gap-0.5 text-[9px] font-black uppercase px-2 py-0.5 mt-1.5 rounded-full ${tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                        {translateStatus(tenant.status)}
                      </span>
                    </td>

                    {/* Room Unit */}
                    <td className="px-6 py-4 font-bold font-mono text-[#FF3737]">{tenant.unit}</td>

                    {/* Contacts */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      <div>{tenant.email}</div>
                      <div className="text-slate-400 mt-0.5">{tenant.phone}</div>
                    </td>

                    {/* Lease Term */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{tenant.leaseStart} ถึง {tenant.leaseEnd}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingTenant(tenant)}
                          className="flex items-center gap-1 rounded-xl border border-[#FFC193]/60 bg-white hover:bg-[#FFEDCE]/10 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-500" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => handleEvict(tenant.id, tenant.unit, tenant.name)}
                          className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>เลิกสัญญา/ย้ายออก</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    ไม่พบข้อมูลผู้เช่าที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Tenant Modal */}
      {isAddModalOpen && (
        <OnboardTenantModal
          rooms={rooms}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => {
            addTenant(data);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* Edit Tenant Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#FFC193]/50 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-150 p-5 bg-[#FFEDCE]/30">
              <h3 className="text-base font-bold text-slate-900">แก้ไขข้อมูลผู้เช่า</h3>
              <button onClick={() => setEditingTenant(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล ผู้เช่า</label>
                  <input
                    type="text"
                    required
                    value={editingTenant.name}
                    onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">หมายเลขห้อง</label>
                  <select
                    value={editingTenant.unit}
                    required
                    onChange={(e) => setEditingTenant({ ...editingTenant, unit: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  >
                    <option value={editingTenant.unit}>{editingTenant.unit} (ปัจจุบัน)</option>
                    {rooms.filter(rm => rm.status === 'Vacant').map(rm => (
                      <option key={rm.id} value={rm.number}>{rm.number} (฿{rm.monthlyRent}/เดือน)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">ที่อยู่อีเมล</label>
                <input
                  type="email"
                  value={editingTenant.email}
                  onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={editingTenant.phone}
                    onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">สถานะ</label>
                  <select
                    value={editingTenant.status}
                    onChange={(e) => setEditingTenant({ ...editingTenant, status: e.target.value as any })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  >
                    <option value="Active">ปกติ</option>
                    <option value="Pending">รอดำเนินการ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">วันเริ่มต้นสัญญา</label>
                  <input
                    type="date"
                    value={editingTenant.leaseStart}
                    onChange={(e) => setEditingTenant({ ...editingTenant, leaseStart: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">วันสิ้นสุดสัญญา</label>
                  <input
                    type="date"
                    value={editingTenant.leaseEnd}
                    onChange={(e) => setEditingTenant({ ...editingTenant, leaseEnd: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-2.5 text-xs font-bold text-white shadow"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
