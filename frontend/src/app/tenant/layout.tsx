'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { TenantProvider } from '@/context/TenantContext';
import { 
  Building2, 
  ChevronRight, 
  DollarSign, 
  FileText, 
  Wrench, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, initialize } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // RBAC Guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_token_local') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_user') : null;
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'tenant') {
        router.push('/login');
      }
    } catch(e) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/tenant/invoices', name: 'Rent Invoices', icon: DollarSign },
    { href: '/tenant/contract', name: 'Contract Info', icon: FileText },
    { href: '/tenant/maintenance', name: 'Report Repairs', icon: Wrench },
    { href: '/tenant/appeal', name: 'File Appeal', icon: MessageSquare },
  ];

  const getPageTitle = () => {
    if (pathname.includes('/invoices')) return 'Rent Invoices';
    if (pathname.includes('/contract')) return 'Contract Agreement';
    if (pathname.includes('/maintenance')) return 'Repair Dispatch';
    if (pathname.includes('/appeal')) return 'Complaint & Appeals';
    return 'Resident Portal';
  };

  return (
    <TenantProvider>
      <div className="flex min-h-screen bg-[#FFEDCE] text-[#2C1A1A] font-sans relative overflow-hidden">
        {/* Decorative Blur Background Blob */}
        <div className="absolute bottom-[-15%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[#FF8383]/10 blur-3xl pointer-events-none z-0"></div>
        <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#FFC193]/15 blur-3xl pointer-events-none z-0"></div>

        {/* Sidebar - Desktop */}
        <aside className={`hidden md:flex shrink-0 flex-col justify-between border-r border-[#FFC193]/30 bg-white/60 backdrop-blur-md relative z-20 transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? 'w-72 p-6 opacity-100' : 'w-0 p-0 opacity-0 border-r-0'
        }`}>
          <div className="min-w-[15rem] space-y-10">
            {/* Logo */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 text-left w-full cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all focus:outline-none"
              title="Collapse Sidebar"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white shadow-lg shadow-[#FF3737]/20">
                <Building2 className="h-6.5 w-6.5" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-[#FF8383] to-[#FF3737] bg-clip-text text-transparent">RentDesk</span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">Resident Space</span>
              </div>
            </button>

            {/* Navigation links */}
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-wide transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow-md shadow-[#FF3737]/15' 
                        : 'text-slate-500 hover:bg-[#FFC193]/15 hover:text-[#FF3737]'
                    }`}
                  >
                    <Icon className="h-5.5 w-5.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Resident Profile Box */}
          <div className="space-y-4 rounded-2xl border border-[#FFC193]/40 bg-white/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEDCE] text-[#FF3737] font-bold">
                {user?.username ? user.username[0].toUpperCase() : 'T'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-sm font-bold text-slate-800 truncate">{user?.username || 'Resident'}</span>
                <span className="block text-[9px] font-extrabold uppercase text-[#FF3737]">
                  Resident Portal
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF8383]/45 bg-white py-2.5 text-xs font-bold text-[#FF3737] hover:bg-[#FF8383]/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#2C1A1A]/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Drawer */}
        <aside className={`fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-md border-r border-[#FFC193]/30 p-6 z-50 flex flex-col justify-between transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all focus:outline-none"
                title="RentDesk Resident Space"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white">
                  <Building2 className="h-5.5 w-5.5" />
                </div>
                <div>
                  <span className="text-lg font-black text-[#FF3737]">RentDesk</span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">Resident Space</span>
                </div>
              </button>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(item.href);
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#FF8383] to-[#FF3737] text-white shadow shadow-[#FF3737]/15' 
                        : 'text-slate-500 hover:bg-[#FFC193]/10 hover:text-[#FF3737]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 rounded-xl border border-[#FFC193]/40 bg-white/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFEDCE] text-[#FF3737] font-bold">
                {user?.username ? user.username[0].toUpperCase() : 'T'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-slate-800 truncate">{user?.username || 'Resident'}</span>
                <span className="block text-[8px] font-extrabold uppercase text-[#FF3737]">
                  Resident Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#FF8383]/45 bg-white py-2 text-xs font-bold text-[#FF3737] hover:bg-[#FF8383]/5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex flex-1 flex-col overflow-y-auto relative z-10 min-h-screen">
          {/* Header */}
          <header className="flex h-20 items-center justify-between border-b border-[#FFC193]/30 bg-[#FFFDF9]/40 backdrop-blur-md px-6 md:px-8 shrink-0">
            {/* Mobile Header elements */}
            <div className="flex items-center gap-3 md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFC193]/40 bg-white/80 text-slate-700 active:scale-95 transition-transform"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all focus:outline-none"
                title="Toggle Menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <span className="text-md font-extrabold tracking-tight text-[#FF3737]">RentDesk</span>
              </button>
            </div>

            {/* Desktop Header elements */}
            {sidebarOpen ? (
              <div className="hidden items-center gap-1.5 md:flex text-sm font-semibold">
                <span className="text-slate-400">Resident Space</span>
                <ChevronRight className="h-4 w-4 text-slate-355" />
                <span className="text-[#FF3737] font-extrabold">{getPageTitle()}</span>
              </div>
            ) : (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="hidden md:flex items-center gap-3 text-left cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all focus:outline-none"
                title="Expand Sidebar"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8383] to-[#FF3737] text-white shadow shadow-[#FF3737]/20">
                  <Building2 className="h-5.5 w-5.5" />
                </div>
                <div>
                  <span className="text-md font-black bg-gradient-to-r from-[#FF8383] to-[#FF3737] bg-clip-text text-transparent">RentDesk</span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">Resident Space</span>
                </div>
              </button>
            )}

            {/* Right Side Header Quick Actions */}
            <div className="flex items-center gap-3">
            </div>
          </header>

          {/* Page Content Container */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </TenantProvider>
  );
}
