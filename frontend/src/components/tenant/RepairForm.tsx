import React, { useState, useRef } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface RepairFormProps {
  onSubmit: (category: string, priority: 'Low' | 'Medium' | 'High', description: string, images: string[]) => void;
}

const priorityMap: { [key: string]: string } = {
  'Low': 'ต่ำ',
  'Medium': 'ปานกลาง',
  'High': 'สูง'
};

export const RepairForm: React.FC<RepairFormProps> = ({ onSubmit }) => {
  const [category, setCategory] = useState('ระบบประปา');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]); // base64 strings
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 10) {
      alert("คุณสามารถแนบรูปภาพได้สูงสุด 10 รูปต่อการแจ้งซ่อม");
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

    onSubmit(category, priority, description, images);
    
    // Reset form
    setDescription('');
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl border border-[#FFC193]/30 bg-white p-6 shadow-sm space-y-5">
      <h3 className="text-xs font-black uppercase tracking-wider text-[#FF3737] border-b pb-2">แจ้งซ่อมแซมใหม่</h3>
      
      {/* Category Select */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase">ประเภทงานซ่อม</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-[#FF3737] focus:bg-white transition-all"
        >
          <option value="ระบบประปา">ระบบประปา / สุขภัณฑ์</option>
          <option value="ระบบไฟฟ้า">ระบบไฟฟ้า</option>
          <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ / ระบบระบายอากาศ</option>
          <option value="เครื่องใช้ไฟฟ้า">เครื่องใช้ไฟฟ้า</option>
          <option value="โครงสร้างประตู/หน้าต่าง/ลูกบิด">โครงสร้าง (ประตู/หน้าต่าง/ลูกบิด)</option>
        </select>
      </div>

      {/* Urgency Priority */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase">ระดับความเร่งด่วน</label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(['Low', 'Medium', 'High'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-xl py-2.5 text-xs font-black uppercase tracking-wider border transition-all ${
                priority === p 
                  ? 'bg-[#FF3737] border-[#FF3737] text-white shadow shadow-[#FF3737]/20' 
                  : 'bg-slate-50 border-slate-200 text-slate-450 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {priorityMap[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Issue Description */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase">รายละเอียดปัญหา</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายความเสียหายอย่างละเอียด (เช่น ท่อน้ำรั่วซึมใต้ซิงก์ล้างจาน, ลูกบิดประตูเสีย)..."
          rows={4}
          className="mt-1.5 block w-full rounded-xl border border-[#FFC193]/60 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF3737] focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Image Uploader */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-500 uppercase">
            แนบรูปภาพ ({images.length} / สูงสุด 10 รูป)
          </label>
          <span className="text-[10px] text-slate-400 font-semibold">รูปแบบไฟล์ที่รองรับ: JPG, PNG</span>
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
              <span className="text-[9px] font-black uppercase">เพิ่ม</span>
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
        ส่งรายการแจ้งซ่อม
      </button>
    </form>
  );
};
