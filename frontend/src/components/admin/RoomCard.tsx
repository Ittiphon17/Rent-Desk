import React from 'react';
import { Room } from '@/types/admin';

interface RoomCardProps {
  rm: Room;
  toggleRoomStatus: (roomNumber: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  rm,
  toggleRoomStatus
}) => {
  return (
    <div className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-black text-slate-900">{rm.number}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
            rm.status === 'Occupied' ? 'bg-[#FFC193]/20 text-[#FF3737] border border-[#FFC193]/40' :
            rm.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
            'bg-slate-50 text-slate-500 border border-slate-200'
          }`}>{rm.status}</span>
        </div>
        <span className="block mt-1 text-xs font-semibold text-slate-400">{rm.type} Unit</span>
        <span className="block mt-1 text-sm font-bold text-slate-700">${rm.monthlyRent}/month</span>
      </div>

      <button
        onClick={() => toggleRoomStatus(rm.number)}
        className="w-full mt-5 rounded-xl bg-[#FFEDCE]/50 hover:bg-[#FFC193]/30 border border-[#FFC193]/50 py-2 text-xs font-bold text-[#FF3737]"
      >
        Cycle Room Status
      </button>
    </div>
  );
};
