import { useState, useMemo } from 'react';
import { mockJobs } from '../../../shared/api/mock-data';

export interface InventoryLot {
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
  const isReceived = i % 2 !== 0; 
  const firstPart = job.stoneapp_parts?.[0];
  return {
    id: `lot-${8000 + i}`,
    materialName: firstPart?.material || 'Unknown Material',
    slabs: 1,
    thickness: firstPart?.thickness || '3cm',
    status: isReceived ? 'on-site' : 'in-transit',
    job_legacy_id: job.legacy_id,
    job_client: job.client_name,
    expected_date: job.scheduled_date || job.created_at
  };
});

mockInventory.push(
  { id: 'lot-8991', materialName: 'Calacatta Gold Marble', slabs: 5, thickness: '2cm', status: 'on-site', job_legacy_id: null, job_client: null, expected_date: new Date().toISOString() },
  { id: 'lot-8992', materialName: 'Super White Quartzite', slabs: 3, thickness: '3cm', status: 'in-transit', job_legacy_id: null, job_client: null, expected_date: new Date(Date.now() + 86400000*3).toISOString() }
);

export function useInventoryController() {
  const [search, setSearch] = useState('');

  const stats = useMemo(() => ({
    total: mockInventory.reduce((acc, lot) => acc + lot.slabs, 0),
    onSite: mockInventory.filter(l => l.status === 'on-site').reduce((acc, lot) => acc + lot.slabs, 0),
    inTransit: mockInventory.filter(l => l.status === 'in-transit').reduce((acc, lot) => acc + lot.slabs, 0)
  }), []);

  const filteredLots = useMemo(() => mockInventory.filter(lot => 
    lot.materialName.toLowerCase().includes(search.toLowerCase()) || 
    lot.id.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return {
    search,
    setSearch,
    stats,
    filteredLots
  };
}
