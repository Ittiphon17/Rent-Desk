import React from 'react';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { Tenant } from '@/types/admin';

interface TenantTableProps {
  filteredTenants: Tenant[];
  handleRemoveTenant: (id: string, unit: string) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  filteredTenants,
  handleRemoveTenant
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#FFC193]/30 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-[#FFEDCE]/40 text-xs font-bold uppercase tracking-wider text-[#FF3737] border-b border-[#FFC193]/20">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Room Unit</th>
              <th className="px-6 py-4">Contacts</th>
              <th className="px-6 py-4">Lease Term</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFC193]/20">
            {filteredTenants.length > 0 ? (
              filteredTenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-[#FFEDCE]/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{tenant.name}</td>
                  <td className="px-6 py-4 font-bold font-mono text-[#FF3737]">{tenant.unit}</td>
                  <td className="px-6 py-4 space-y-0.5 text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{tenant.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{tenant.leaseStart} to {tenant.leaseEnd}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveTenant(tenant.id, tenant.unit)}
                      className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 px-2.5 py-1.5 text-xs font-bold text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                      Evict/End Lease
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">No tenants currently registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
