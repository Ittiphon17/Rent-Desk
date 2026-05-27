import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Room } from '@/types/admin';
import { translateStatus } from '@/lib/translate';

interface KeyRackStatusProps {
  rooms: Room[];
  setActiveTab: (tab: any) => void;
}

export const KeyRackStatus: React.FC<KeyRackStatusProps> = ({
  rooms,
  setActiveTab
}) => {
  return (
    <div className="md:col-span-5 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-bold text-slate-900 text-base">ห้องพัก</h3>
        <button onClick={() => setActiveTab('rooms')} className="text-xs font-bold text-[#FF3737] hover:underline flex items-center gap-0.5">
          ดูทั้งหมด <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {rooms.slice(0, 6).map(rm => (
          <div key={rm.id} className={`rounded-xl p-2.5 border text-center font-bold ${
            rm.status === 'Occupied' ? 'bg-[#FFC193]/15 border-[#FFC193]/40 text-slate-800' :
            rm.status === 'Maintenance' ? 'bg-rose-50 border-rose-100 text-rose-700' :
            'bg-white border-slate-100 text-slate-450'
          }`}>
            <span className="block text-xs">{rm.number}</span>
            <span className="text-[8px] uppercase tracking-wider block mt-0.5">{translateStatus(rm.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
