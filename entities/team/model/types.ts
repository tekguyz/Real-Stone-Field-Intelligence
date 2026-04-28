import { TeamStatus } from "../../../lib/constants/statuses";

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: TeamStatus;
  pin: string;
  email: string;
  phone: string;
  job_id?: string;
  isInstaller: boolean;
}
