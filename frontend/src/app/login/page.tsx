"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, initialize, user } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);

  // Initialize store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'tenant') {
        router.push('/tenant');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalValidationError(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setLocalValidationError('Please enter a username and password.');
      return;
    }

    const success = await login(trimmedUser, trimmedPass);
    if (success) {
      // Handled by redirect hook
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEDCE] p-4 font-sans text-[#2C1A1A] relative overflow-hidden">
      {/* Luxurious Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#FF8383]/20 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#FFC193]/30 blur-3xl"></div>

      {/* Main card container */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#FFC193]/40 bg-white/80 shadow-2xl backdrop-blur-md md:grid md:grid-cols-12">
        
        {/* Left Side: Modern Luxury branding */}
        <div className="relative hidden flex-col justify-between p-10 md:col-span-5 md:flex bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          
          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#FF3737] shadow-lg shadow-black/5">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">RentDesk</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-[#FFEDCE]">Luxe Spaces</span>
            </div>
          </div>

          {/* Slogan */}
          <div className="my-auto py-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide uppercase text-[#FFEDCE] mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Elevate Living
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Sleek. <br />
              Vibrant. <br />
              Connected.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#FFEDCE]/90 font-medium">
              Manage your apartment lease, check dynamic bills, and request fast repairs on our premium mobile-first platform.
            </p>
          </div>

          <div className="text-xs text-[#FFEDCE]/80 font-semibold">
            &copy; {new Date().getFullYear()} RentDesk Premium Properties.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:col-span-7 bg-white/40">
          
          {/* Mobile Header */}
          <div className="mb-6 flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#FF3737]">RentDesk</span>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login Portal</h3>
            <p className="mt-1.5 text-sm text-slate-500 font-semibold">Unlock access to your residence portal.</p>
          </div>

          {/* Alert messages */}
          {(error || localValidationError) && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-slate-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF3737]" />
              <div>
                <p className="font-bold text-rose-900 text-sm">Action Required</p>
                <p className="mt-0.5 text-xs font-semibold text-[#FF3737]">{localValidationError || error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Username / Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  disabled={isLoading}
                  className="block w-full rounded-2xl border border-[#FFC193]/60 bg-white/60 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#FF3737] focus:bg-white focus:ring-1 focus:ring-[#FF3737] disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="block w-full rounded-2xl border border-[#FFC193]/60 bg-white/60 py-3 pl-11 pr-11 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#FF3737] focus:bg-white focus:ring-1 focus:ring-[#FF3737] disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-650"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF8383] to-[#FF3737] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF3737]/20 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Premium Demo Credentials Box */}
          <div className="mt-8 rounded-2xl border border-[#FFC193]/50 bg-[#FFC193]/10 p-4">
            <div className="flex items-center gap-2 text-[#FF3737]">
              <Info className="h-4.5 w-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Quick Sandbox logins</span>
            </div>
            <div className="mt-2 text-xs text-slate-600 font-semibold space-y-2">
              <p>• Admin Access: <code className="bg-white/80 border border-[#FFC193]/30 px-1.5 py-0.5 rounded text-[#FF3737]">admin</code> / password: <code className="bg-white/80 border border-[#FFC193]/30 px-1.5 py-0.5 rounded text-[#FF3737]">111</code></p>
              <p>• Tenant Access: <code className="bg-white/80 border border-[#FFC193]/30 px-1.5 py-0.5 rounded text-[#FF3737]">tenant</code> / password: <code className="bg-white/80 border border-[#FFC193]/30 px-1.5 py-0.5 rounded text-[#FF3737]">333</code></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
