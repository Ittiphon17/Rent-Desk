"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tenant/invoices');
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF3737] border-t-transparent"></div>
        <p className="text-sm font-bold text-slate-550">Redirecting to invoices...</p>
      </div>
    </div>
  );
}
