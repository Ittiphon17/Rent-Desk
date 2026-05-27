import React from 'react';
import { MaintenanceTicket } from '@/types/tenant';
import { Sparkles } from 'lucide-react';
import { translateStatus } from '@/lib/translate';

interface RepairFeedProps {
  tickets: MaintenanceTicket[];
}

const translatePriority = (priority: string) => {
  const p = priority.toLowerCase();
  if (p === 'low') return 'ต่ำ';
  if (p === 'medium') return 'ปานกลาง';
  if (p === 'high') return 'สูง';
  if (p === 'urgent') return 'ด่วนที่สุด';
  return priority;
};

export const RepairFeed: React.FC<RepairFeedProps> = ({ tickets }) => {
  return (
    <div className="lg:col-span-5 space-y-4">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b pb-2">
        <Sparkles className="h-4 w-4 text-[#FF3737]" />
        <span>รายการแจ้งซ่อม</span>
      </h3>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {tickets.map(tkt => (
          <div key={tkt.id} className="rounded-2xl border border-[#FFC193]/35 bg-white p-4.5 shadow-sm space-y-3 hover:border-[#FF8383]/45 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#FF3737] uppercase">{tkt.category}</span>
              <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase border ${
                tkt.status === 'Resolved' ? 'bg-[#AED6CF]/30 text-emerald-800 border-emerald-200' :
                tkt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                'bg-slate-50 text-slate-500 border border-slate-200'
              }`}>{translateStatus(tkt.status)}</span>
            </div>
            
            <p className="text-xs font-semibold text-slate-750 leading-relaxed whitespace-pre-line">{tkt.description}</p>
            
            {/* Images in ticket feed */}
            {tkt.images && tkt.images.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tkt.images.map((img, imgIdx) => (
                  <div key={imgIdx} className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={img} 
                      alt="attached repair proof" 
                      className="h-full w-full object-cover cursor-zoom-in"
                      onClick={() => {
                        const newWin = window.open();
                        newWin?.document.write(`<img src="${img}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 pt-2.5 border-t border-slate-50">
              <span>ความสำคัญ: {translatePriority(tkt.priority)}</span>
              <span>แจ้งเมื่อ: {tkt.date}</span>
            </div>
          </div>
        ))}
        
        {tickets.length === 0 && (
          <p className="text-center py-12 text-xs text-slate-400 font-semibold bg-white/50 border border-[#FFC193]/35 rounded-2xl p-6">
            ไม่พบรายการแจ้งซ่อม
          </p>
        )}
      </div>
    </div>
  );
};
