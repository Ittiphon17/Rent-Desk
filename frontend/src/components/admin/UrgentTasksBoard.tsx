import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AdminMaintenanceTicket } from '@/types/admin';

interface UrgentTasksBoardProps {
  tickets: AdminMaintenanceTicket[];
  setActiveTab: (tab: any) => void;
}

export const UrgentTasksBoard: React.FC<UrgentTasksBoardProps> = ({
  tickets,
  setActiveTab
}) => {
  const activeTickets = tickets.filter(t => t.status !== 'Resolved');

  return (
    <div className="md:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-bold text-slate-900 text-base">Urgent Tasks Board</h3>
        <button onClick={() => setActiveTab('maintenance')} className="text-xs font-bold text-[#FF3737] hover:underline flex items-center gap-0.5">
          Dispatch <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      
      <div className="space-y-3">
        {activeTickets.slice(0, 2).map(tkt => (
          <div key={tkt.id} className="rounded-xl border border-[#FFC193]/20 bg-[#FFEDCE]/20 p-4 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Unit {tkt.unit} - {tkt.category}</span>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{tkt.description}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              tkt.priority === 'High' ? 'bg-[#FF3737]/10 text-[#FF3737] border border-[#FF3737]/20' : 'bg-amber-100 text-amber-700'
            }`}>{tkt.priority}</span>
          </div>
        ))}
        {activeTickets.length === 0 && (
          <p className="text-slate-450 text-center py-6 font-semibold">Repairs queue clear!</p>
        )}
      </div>
    </div>
  );
};
