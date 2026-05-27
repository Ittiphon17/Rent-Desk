import React from 'react';
import { AdminMaintenanceTicket } from '@/types/admin';
import { translateStatus, translatePriority } from '@/lib/translate';

interface TicketCardProps {
  tkt: AdminMaintenanceTicket;
  advanceTicketStatus: (id: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  tkt,
  advanceTicketStatus
}) => {
  return (
    <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-slate-900 font-mono">ห้อง {tkt.unit}</span>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
            tkt.priority === 'High' ? 'bg-[#FF3737]/10 text-[#FF3737]' : 'bg-amber-100 text-amber-800'
          }`}>ระดับความสำคัญ: {translatePriority(tkt.priority)}</span>
        </div>
        <h4 className="text-xs font-extrabold text-[#FF3737] uppercase">{tkt.category}</h4>
        <p className="text-sm text-slate-655 font-medium">{tkt.description}</p>
        <span className="block text-[10px] font-bold text-slate-400">วันที่แจ้ง: {tkt.date}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
          tkt.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800' :
          tkt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
          'bg-slate-100 text-slate-500'
        }`}>
          {translateStatus(tkt.status)}
        </span>
        {tkt.status !== 'Resolved' && (
          <button
            onClick={() => advanceTicketStatus(tkt.id)}
            className="rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-4 py-2.5 text-xs font-bold shadow"
          >
            {tkt.status === 'Open' ? 'เริ่มดำเนินการ' : 'เสร็จสิ้นงาน'}
          </button>
        )}
      </div>
    </div>
  );
};
