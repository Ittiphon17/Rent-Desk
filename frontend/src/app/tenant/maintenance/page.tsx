"use client";

import React, { useState, useRef } from 'react';
import { useTenant } from '../layout';
import { Wrench, CheckCircle2, Image as ImageIcon, Trash2, X, Plus, Sparkles } from 'lucide-react';

export default function MaintenancePage() {
  const { tickets, addTicket } = useTenant();

  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]); // base64 strings
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Check limit
    if (images.length + files.length > 10) {
      alert("You can attach a maximum of 10 images per ticket.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addTicket(category, priority, description, images);
    
    // Reset form
    setDescription('');
    setImages([]);
    setSuccessMsg('Repair ticket created successfully! Our maintenance crew will contact you shortly.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Wrench className="h-8 w-8 text-[#FF3737]" />
          <span>Repair Dispatch</span>
        </h1>
        <p className="text-slate-555 text-sm font-semibold mt-1">Report apartment issues and request technical assistance directly.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-bold text-sm shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">New Repair Request</h3>
          
          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-[#FF3737] focus:bg-white transition-all"
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC / Climate Control</option>
              <option value="Appliance">Appliances</option>
              <option value="Structural">Structural (Door/Locks)</option>
            </select>
          </div>

          {/* Urgency Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Urgency level</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as any)}
                  className={`rounded-xl py-2.5 text-xs font-black uppercase tracking-wider border transition-all ${
                    priority === p 
                      ? 'bg-[#FF3737] border-[#FF3737] text-white shadow shadow-[#FF3737]/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-450 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Issue Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the defect in detail (e.g., leakage under kitchen sink, broken door latch)..."
              rows={4}
              className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Image Uploader */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Attach Images ({images.length} / 10 max)
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">Supported formats: JPG, PNG</span>
            </div>
            
            {/* Thumbnail preview list */}
            <div className="grid grid-cols-5 gap-2 mt-1.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`uploaded preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-[#2C1A1A]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-xl"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
              
              {/* Trigger box */}
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed border-[#FFC193] hover:border-[#FF3737] bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center gap-1 text-[#FF3737] transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[9px] font-black uppercase">Add</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-3 text-xs font-black uppercase tracking-wider text-white shadow hover:brightness-105 transition-all shadow-[#FF3737]/15 hover:shadow-[#FF3737]/25"
          >
            Submit Repair Ticket
          </button>
        </form>

        {/* Status Feed */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b pb-2">
            <Sparkles className="h-4 w-4 text-[#FF3737]" />
            <span>Repair Feed</span>
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
                  }`}>{tkt.status}</span>
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
                  <span>Priority: {tkt.priority}</span>
                  <span>Filed: {tkt.date}</span>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <p className="text-center py-12 text-xs text-slate-400 font-semibold bg-white/50 border border-[#FFC193]/35 rounded-2xl p-6">
                No reported repair work tickets found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
