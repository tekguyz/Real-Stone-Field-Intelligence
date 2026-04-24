export type JobStatus = 'pending' | 'assigned' | 'in_progress' | 'submitted_for_review' | 'verified';

export interface SlabInfo {
  material: string;
  finish: string;
  thickness: string;
  slabs: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zip: string;
  community?: string;
}

export interface Job {
  id: string;
  legacy_id: string;
  client_name: string;
  location: Location;
  slab_info: SlabInfo;
  status: JobStatus;
  install_date: string; // ISO string
  installer_id?: string;
  logistics_notes?: string;
}
