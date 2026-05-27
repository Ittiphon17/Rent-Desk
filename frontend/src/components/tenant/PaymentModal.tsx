'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Invoice } from '@/types/tenant';
import {
  X,
  CheckCircle2,
  Upload,
  Copy,
  Check,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  QrCode,
  ShieldCheck
} from 'lucide-react';

interface PaymentModalProps {
  inv: Invoice;
  onClose: () => void;
  onSubmitSlip: (id: string, slipImage: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  inv,
  onClose,
  onSubmitSlip
}) => {
  const [step, setStep] = useState<'qr' | 'upload' | 'success'>('qr');
  const [copied, setCopied] = useState(false);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(inv.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSimulateSlip = () => {
    // Inject a realistic-looking bank receipt data URL / sample placeholder for demo simulation
    setSlipImage("/QR-payment.jpg");
  };

  const handleSubmit = () => {
    if (slipImage) {
      onSubmitSlip(inv.id, slipImage);
      setStep('success');
    }
  };

  /* ── Step indicator dots ── */
  const steps = ['qr', 'upload', 'success'] as const;
  const currentIdx = steps.indexOf(step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-2 pb-12 sm:pb-2 p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Card — responsive width + safe vertical padding */}
      <div className="relative w-[calc(100%-2rem)] sm:w-full max-w-md mx-auto my-6 sm:my-10 bg-white rounded-3xl border border-[#FFC193]/30 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-5rem)] animate-slideUp">

        {/* ── Header ── */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#FFEDCE]/40 text-[#FF3737] shrink-0 border border-[#FFC193]/30">
              {step === 'qr' && <QrCode className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
              {step === 'upload' && <Upload className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
              {step === 'success' && <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-wide truncate">
                {step === 'qr' && 'Scan QR Payment'}
                {step === 'upload' && 'Attach Bank Slip'}
                {step === 'success' && 'Payment Submitted'}
              </h3>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mt-1">
                {steps.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= currentIdx
                        ? 'bg-[#FF3737] w-5 sm:w-6'
                        : 'bg-slate-200 w-3 sm:w-4'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="px-5 py-5 sm:px-6 sm:py-6 overflow-y-auto flex-1 text-slate-750">

          {/* ╔══ STEP 1: QR Code ══╗ */}
          {step === 'qr' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Payment Details Callout */}
              <div className="bg-gradient-to-r from-[#FFEDCE]/25 to-[#FFC193]/10 border border-[#FFC193]/35 rounded-2xl p-4 sm:p-5 flex justify-between items-center gap-3">
                <div>
                  <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-black text-[#FF3737] tracking-tight">
                    ฿{inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Period</span>
                  <span className="text-xs font-bold text-slate-700">{inv.month}</span>
                </div>
              </div>

              {/* QR Image Frame */}
              <div className="relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#FFC193]/20 bg-gradient-to-b from-[#FFFDF9] to-white shadow-inner mx-auto w-fit">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
                  <img
                    src="/QR-payment.jpg"
                    alt="PromptPay QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black text-[#FF3737] uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  <span>PromptPay Instant QR</span>
                </div>
              </div>

              {/* Transfer Details Card */}
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 text-xs border border-slate-100">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 gap-2">
                  <span className="font-semibold text-slate-500 shrink-0">Beneficiary</span>
                  <span className="font-bold text-slate-800 text-right truncate">RentDesk Condominiums Co.</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 gap-2">
                  <span className="font-semibold text-slate-500 shrink-0">Reference ID</span>
                  <button
                    onClick={handleCopyRef}
                    className="flex items-center gap-1 font-mono font-bold text-[#FF3737] hover:text-[#FF8383] transition-colors focus:outline-none"
                    title="Click to copy Reference ID"
                  >
                    <span>{inv.id}</span>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ╔══ STEP 2: Upload Slip ══╗ */}
          {step === 'upload' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Slip uploader zone */}
              <div
                className={`relative rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all min-h-[180px] sm:min-h-[220px] ${
                  dragActive ? 'border-[#FF3737] bg-[#FFEDCE]/10' : 'border-[#FFC193]/30 bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]/80'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {slipImage ? (
                  <div className="relative w-full space-y-3 sm:space-y-4">
                    <div className="relative max-w-[160px] sm:max-w-[200px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-[#FFC193]/35 shadow-md bg-white">
                      <img
                        src={slipImage}
                        alt="Uploaded Payment Slip"
                        className="w-full h-auto object-contain max-h-[180px] sm:max-h-[220px]"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setSlipImage(null)}
                        className="rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold transition-all focus:outline-none"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3 py-2 sm:py-4 cursor-pointer w-full h-full" onClick={triggerFileInput}>
                    <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#FFEDCE]/40 text-[#FF3737] flex items-center justify-center border border-[#FFC193]/40">
                      <Upload className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-black text-slate-700">Click to upload transaction slip</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-1">or drag and drop slip image here</p>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider">Supports PNG, JPG, JPEG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Simulation Quick-Select */}
              {!slipImage && (
                <div className="bg-[#FFEDCE]/15 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[#FFC193]/30 text-center space-y-2 sm:space-y-2.5">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-650">No receipt slip? Click below to generate a demo slip.</p>
                  <button
                    onClick={handleSimulateSlip}
                    className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-black shadow-md shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>⚡ Generate Mock Slip (Demo)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ╔══ STEP 3: Success ══╗ */}
          {step === 'success' && (
            <div className="py-6 sm:py-8 text-center space-y-4 sm:space-y-5 flex flex-col items-center justify-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-250 shadow-md">
                <CheckCircle2 className="h-7 w-7 sm:h-9 sm:w-9" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-black text-slate-800">Slip Uploaded Successfully!</h4>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                  Your payment receipt has been submitted. The invoice status is now set to waiting for checking <strong className="text-[#FF3737] font-bold">&quot;Verificata&quot;</strong>. An administrator will verify the transaction shortly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-100 w-full max-w-[200px] sm:max-w-xs text-xs font-semibold text-slate-500">
                <span className="block text-[8px] font-black uppercase text-slate-400 mb-1">Assigned Ref ID</span>
                <span className="font-mono text-slate-800 font-bold">{inv.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-t border-slate-100 bg-slate-50/80 shrink-0 flex justify-end gap-2.5 sm:gap-3 rounded-b-3xl">
          {step === 'qr' && (
            <button
              onClick={() => setStep('upload')}
              className="rounded-xl sm:rounded-2xl bg-[#2C1A1A] hover:bg-slate-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black tracking-wide flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98] focus:outline-none w-full sm:w-auto justify-center"
            >
              <span>Attach Payment Slip</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}

          {step === 'upload' && (
            <>
              <button
                onClick={() => setStep('qr')}
                className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all focus:outline-none"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!slipImage}
                className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black tracking-wide shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 focus:outline-none flex-1 sm:flex-initial justify-center"
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Submit Slip for Check</span>
              </button>
            </>
          )}

          {step === 'success' && (
            <button
              onClick={onClose}
              className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black tracking-wide shadow-lg shadow-[#FF3737]/15 hover:brightness-105 active:scale-[0.98] transition-all focus:outline-none w-full sm:w-auto justify-center flex items-center"
            >
              Done & Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
