"use client";

import React, { useState, useContext, useMemo } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { Room } from '@/types/admin';
import { 
  Search, 
  Plus, 
  X, 
  Edit, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Eye
} from 'lucide-react';

export default function AdminRoomsPage() {
  const context = useContext(AdminContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Occupied' | 'Vacant' | 'Maintenance'>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Studio' as Room['type'],
    monthlyRent: 950,
    status: 'Vacant' as Room['status']
  });

  if (!context) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
      </div>
    );
  }

  const { rooms, addRoom, editRoom, toggleRoomStatus } = context;

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(rm => {
      const matchesSearch = rm.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            rm.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || rm.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchTerm, statusFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.number.trim()) return;

    addRoom(newRoom);
    setNewRoom({
      number: '',
      type: 'Studio',
      monthlyRent: 950,
      status: 'Vacant'
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    editRoom(editingRoom.id, {
      number: editingRoom.number,
      type: editingRoom.type,
      monthlyRent: editingRoom.monthlyRent,
      status: editingRoom.status
    });
    setEditingRoom(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Apartment Inventory</h1>
          <p className="text-slate-500 text-sm font-semibold">Configure vacancy modes, adjust monthly rental rates, and track room statuses.</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by Room Number (e.g. A-101, Penthouse)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-2xl border border-[#FFC193]/50 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] transition-all shadow-sm"
          />
        </div>
        
        <div className="md:col-span-4 flex rounded-2xl border border-[#FFC193]/50 bg-white p-1 shadow-sm">
          {(['All', 'Vacant', 'Occupied', 'Maintenance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === tab
                  ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#FF3737]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredRooms.map(rm => (
          <div 
            key={rm.id} 
            className="rounded-2xl border border-[#FFC193]/30 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Status indicators */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl font-black text-slate-900 block font-mono">{rm.number}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mt-1">{rm.type}</span>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                rm.status === 'Occupied' 
                  ? 'bg-[#FFC193]/15 text-[#FF3737] border-[#FFC193]/30' 
                  : rm.status === 'Maintenance' 
                  ? 'bg-rose-50 text-rose-700 border-rose-100' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {rm.status === 'Vacant' ? 'Available' : rm.status === 'Maintenance' ? 'Maintenance' : 'Occupied'}
              </span>
            </div>

            <div className="mt-4 border-t border-slate-50 pt-3">
              <span className="text-slate-400 text-xs font-medium block">Monthly Rent</span>
              <span className="text-2xl font-black text-slate-900 font-mono">${rm.monthlyRent}</span>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setEditingRoom(rm)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-[#FFC193]/60 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-[#FFEDCE]/20 transition-colors"
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => toggleRoomStatus(rm.number)}
                className="flex-1 rounded-xl bg-[#FFEDCE]/50 hover:bg-[#FFC193]/30 border border-[#FFC193]/50 py-2 text-xs font-bold text-[#FF3737] transition-colors"
              >
                Toggle Mode
              </button>
            </div>
          </div>
        ))}
        {filteredRooms.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#FFC193]/30">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-400 text-sm">No rooms match the filters.</p>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#FFC193]/50 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-150 p-5 bg-[#FFEDCE]/30">
              <h3 className="text-base font-bold text-slate-900">Add New Unit</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Room Number / Name</label>
                <input
                  type="text"
                  required
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                  placeholder="e.g. B-110"
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Unit Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as any })}
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                >
                  <option value="Studio">Studio</option>
                  <option value="1-Bedroom">1-Bedroom</option>
                  <option value="2-Bedroom">2-Bedroom</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Monthly Rental ($)</label>
                  <input
                    type="number"
                    required
                    value={newRoom.monthlyRent}
                    onChange={(e) => setNewRoom({ ...newRoom, monthlyRent: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Initial Status</label>
                  <select
                    value={newRoom.status}
                    onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as any })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  >
                    <option value="Vacant">Available (Vacant)</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-2.5 text-xs font-bold text-white shadow"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#FFC193]/50 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-150 p-5 bg-[#FFEDCE]/30">
              <h3 className="text-base font-bold text-slate-900">Edit Room Details</h3>
              <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Room Number / Name</label>
                <input
                  type="text"
                  required
                  value={editingRoom.number}
                  onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Unit Type</label>
                <select
                  value={editingRoom.type}
                  onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value as any })}
                  className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                >
                  <option value="Studio">Studio</option>
                  <option value="1-Bedroom">1-Bedroom</option>
                  <option value="2-Bedroom">2-Bedroom</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Monthly Rental ($)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.monthlyRent}
                    onChange={(e) => setEditingRoom({ ...editingRoom, monthlyRent: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Room Status</label>
                  <select
                    value={editingRoom.status}
                    onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as any })}
                    className="mt-1 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-2.5 text-sm text-slate-800 outline-none focus:border-[#FF3737]"
                  >
                    <option value="Vacant">Available (Vacant)</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-2.5 text-xs font-bold text-white shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
