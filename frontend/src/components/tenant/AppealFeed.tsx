import React from 'react';
import { Appeal } from '@/types/tenant';
import { Sparkles } from 'lucide-react';
import { translateStatus } from '@/lib/translate';

interface AppealFeedProps {
  appeals: Appeal[];
}

export const AppealFeed: React.FC<AppealFeedProps> = ({ appeals }) => {
  return (
    <div className="lg:col-span-5 space-y-4">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b pb-2">
        <Sparkles className="h-4 w-4 text-[#FF3737]" />
        <span>ประวัติการร้องเรียน</span>
      </h3>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {appeals.map(apl => (
          <div key={apl.id} className="rounded-2xl border border-[#FFC193]/35 bg-white p-4.5 shadow-sm space-y-3.5 hover:border-[#FF8383]/45 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#FF3737] uppercase">{apl.category}</span>
              <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase border ${
                apl.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800 border-emerald-255' :
                apl.status === 'In Review' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                'bg-slate-50 text-slate-550 border border-slate-200'
              }`}>
                {apl.status === 'Resolved' ? 'แก้ไขแล้ว' :
                 apl.status === 'In Review' ? 'กำลังตรวจสอบ' :
                 translateStatus(apl.status)}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-750 leading-relaxed whitespace-pre-line">{apl.details}</p>

            <div className="pt-2 border-t border-slate-50 space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>ผู้ยื่นคำร้อง: {apl.complainantName}</span>
                <span>เบอร์โทร: {apl.contactNumber}</span>
              </div>
              <div className="text-[9px] font-bold text-slate-400 text-right">
                <span>วันที่ยื่น: {apl.date}</span>
              </div>
            </div>
          </div>
        ))}

        {appeals.length === 0 && (
          <p className="text-center py-12 text-xs text-slate-400 font-semibold bg-white/50 border border-[#FFC193]/35 rounded-2xl p-6">
            ไม่มีประวัติการยื่นเรื่องร้องเรียน
          </p>
        )}
      </div>
    </div>
  );
};
