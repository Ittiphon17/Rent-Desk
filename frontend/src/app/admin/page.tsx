"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/overview');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEDCE] text-[#2C1A1A]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
        <span className="text-sm font-bold">Loading dashboard...</span>
      </div>
    </div>
  );
}
