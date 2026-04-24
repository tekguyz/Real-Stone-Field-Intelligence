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

export interface Job {
  id: string;
  legacy_id: string;
  project_id: string | null;
  client_name: string;
  address: string;
  stoneapp_parts: JobScopePart[] | null;
  status: JobStatus;
  job_type: JobType;
  scheduled_date: string | null; // Date string
  installer_id: string | null;
  logistics_notes: string | null;
  photos?: string[];
  signature_url?: string | null;
  created_at: string;
  updated_at: string;
}
