'use client';

import { useState } from 'react';
import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { mockJobs } from '../../../shared/api/mock-data';
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  Truck,
  Building2,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react';

// Generate mock inventory based on existing jobs
interface InventoryLot {
  id: string;
  materialName: string;
  slabs: number;
  thickness: string;
  status: 'on-site' | 'in-transit';
  job_legacy_id: string | null;
  job_client: string | null;
  expected_date: string;
}

const mockInventory: InventoryLot[] = mockJobs.flatMap((job, i) => {
  const isReceived = i % 3 !== 0; // arbitrary mixing based on index
  return {
    id: `lot-${8000 + i}`,
    materialName: job.slab_info.material,
    slabs: job.slab_info.slabs,
    thickness: job.slab_info.thickness,
    status: isReceived ? 'on-site' : 'in-transit',
    job_legacy_id: job.legacy_id,
    job_client: job.client_name,
    expected_date: job.install_date
  };
});

// also add a few unassigned slabs
mockInventory.push(
  { id: 'lot-8991', materialName: 'Calacatta Gold Marble', slabs: 5, thickness: '2cm', status: 'on-site', job_legacy_id: null, job_client: null, expected_date: new Date().toISOString() },
  { id: 'lot-8992', materialName: 'Super White Quartzite', slabs: 3, thickness: '3cm', status: 'in-transit', job_legacy_id: null, job_client: null, expected_date: new Date(Date.now() + 86400000*3).toISOString() }
);


export default function InventoryPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [search, setSearch] = useState('');

  const stats = {
    total: mockInventory.reduce((acc, lot) => acc + lot.slabs, 0),
    onSite: mockInventory.filter(l => l.status === 'on-site').reduce((acc, lot) => acc + lot.slabs, 0),
    inTransit: mockInventory.filter(l => l.status === 'in-transit').reduce((acc, lot) => acc + lot.slabs, 0)
  };

  const filteredLots = mockInventory.filter(lot => 
    lot.materialName.toLowerCase().includes(search.toLowerCase()) || 
    lot.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.slabInventory}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">MASTER MATERIAL TRACKING LOG</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Search by Lot # or Material..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-rsg-surface/50 text-foreground/60 font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">{t.lotNumber}</th>
                    <th className="px-6 py-4">{t.materialType}</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">{t.status}</th>
                    <th className="px-6 py-4">{t.jobLink}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLots.map(lot => (
                    <tr key={lot.id} className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">{lot.id.toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground/90">{lot.materialName}</span>
                          <span className="text-[10px] text-foreground/40 font-mono uppercase">{lot.thickness}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{lot.slabs} SLABS</td>
                      <td className="px-6 py-4">
                        {lot.status === 'on-site' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border border-green-500/20 bg-green-500/10 text-green-500">
                            <Building2 className="w-3 h-3" />
                            {t.onSiteWarehouse}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/20 bg-blue-500/10 text-blue-500">
                            <Truck className="w-3 h-3" />
                            {t.inTransit}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lot.job_legacy_id ? (
                          <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <LinkIcon className="w-3 h-3 text-foreground/40" />
                            <div className="flex flex-col">
                              <span className="font-mono text-[10px] leading-none mb-1">{lot.job_legacy_id}</span>
                              <span className="text-xs text-foreground/70 truncate max-w-[120px]">{lot.job_client}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-foreground/30 font-mono italic">UNASSIGNED STOCK</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLots.length === 0 && (
              <div className="p-8 text-center text-foreground/50 text-sm">
                No matching lots found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Metrics (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
            <Package className="w-5 h-5 text-primary" />
            Inventory Metrics
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-card border-l-8 border-foreground p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
              <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">TOTAL SLABS</p>
              <div className="text-3xl font-bold text-foreground mt-1">{stats.total}</div>
            </div>

            <div className="bg-card border-l-8 border-green-500 p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
              <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">{t.onSiteWarehouse}</p>
               <div className="text-3xl font-bold text-foreground mt-1">{stats.onSite}</div>
            </div>

            <div className="bg-card border-l-8 border-blue-500 p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
              <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">{t.inTransit}</p>
               <div className="text-3xl font-bold text-foreground mt-1">{stats.inTransit}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
