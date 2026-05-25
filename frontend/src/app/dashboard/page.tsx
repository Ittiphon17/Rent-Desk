"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardFallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_token_local') : null;
    const userString = typeof window !== 'undefined' ? localStorage.getItem('rent_desk_user') : null;
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'tenant') {
          router.push('/tenant');
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-[#FFEDCE] text-[#2C1A1A] font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
        <p className="text-base font-bold tracking-wide text-[#FF3737]">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
