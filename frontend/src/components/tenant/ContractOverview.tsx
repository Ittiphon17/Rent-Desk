import React from 'react';
import { Building, Calendar } from 'lucide-react';

export const ContractOverview: React.FC = () => {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">สรุปสัญญาเช่า</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">ชื่อโครงการ</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-1">
              <Building className="h-4 w-4 text-[#FF8383]" />
              เรนท์เดสก์ คอนโด
            </span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">ห้องพักที่ได้รับจัดสรร</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">B-101 (1 ห้องนอน)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">ระยะเวลาสัญญาเช่า</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">12 เดือน (สัญญาประเภทระยะเวลาคงที่)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">เงินประกันความเสียหาย</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">฿2,200.00 (ชำระครบถ้วนแล้ว)</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">ค่าเช่าพื้นฐานรายเดือน</span>
            <span className="text-lg font-black text-[#FF3737] mt-0.5 block">฿1,500.00</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">กำหนดชำระเงิน</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">ก่อนวันที่ 5 ของทุกเดือน</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <span className="block text-[9px] uppercase font-black text-slate-400">วันเริ่มต้นสัญญาเช่า</span>
              <span className="text-xs font-bold text-slate-700">01 มิถุนายน 2568</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#FF8383] shrink-0" />
            <div>
              <span className="block text-[9px] uppercase font-black text-slate-400">วันสิ้นสุดสัญญาเช่า</span>
              <span className="text-xs font-bold text-slate-700">31 พฤษภาคม 2569</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">กฎระเบียบและแนวทางปฏิบัติ</h3>

        <ul className="space-y-2.5 text-xs text-slate-650 font-semibold leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>การชำระค่าเช่า:</strong> ใบแจ้งหนี้ค่าเช่าจะคำนวณในวันที่ 25 ของทุกเดือน และผู้เช่าต้องชำระค่าเช่าไม่เกินวันที่ 5 มิฉะนั้นจะถูกคิดค่าปรับ ฿100 ต่อวันจนกว่าจะชำระ</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>ช่วงเวลาความสงบ:</strong> งดใช้เสียงตั้งแต่เวลา 22:00 น. ถึง 07:00 น. ของทุกวัน เพื่อความเป็นส่วนตัวและความสงบเรียบร้อยของผู้พักอาศัยทุกท่าน</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3737] mt-1.5 shrink-0" />
            <span><strong>นโยบายเกี่ยวกับสัตว์เลี้ยง:</strong> อนุญาตเฉพาะสัตว์เลี้ยงขนาดเล็กเท่านั้น โดยต้องอยู่ภายใต้เงื่อนไขข้อตกลงเพิ่มเติมและลงทะเบียนพร้อมวางเงินประกัน</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
