export type JobStatus = 'pending' | 'assigned' | 'in_progress' | 'submitted_for_review' | 'verified';
export type JobType = 'template' | 'install' | 'service';

export interface JobScopePart {
  partType: string;
  material: string;
  slabId: string;
  thickness: string;
  seams: number;
  edgeProfile: string;
}

export interface CapturedProof {
  url: string;
  timestamp: number;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  location_status?: string;
}

export interface Job {
  id: string;
  legacy_id: string;
  wo_number?: string;
  project_id: string | null;
  client_name: string;
  address: string;
  stoneapp_parts: JobScopePart[] | null;
  status: JobStatus;
  job_type: JobType;
  scheduled_date: string | null; // Date string
  scheduled_arrival?: string | null;
  city_name?: string | null;
  community_name?: string | null;
  installer_id: string | null;
  logistics_notes: string | null;
  photos?: string[];
  captured_proof?: CapturedProof[];
  signature_url?: string | null;
  created_at: string;
  updated_at: string;
}
