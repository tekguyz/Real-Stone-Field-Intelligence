export const JOB_STATUSES = {
  ASSIGNED: 'Assigned',
  PENDING:  'Pending',
  ACTIVE:   'Active',
  REVIEW:   'Review',
  VERIFIED: 'Verified',
} as const;

export type JobStatus = typeof JOB_STATUSES[keyof typeof JOB_STATUSES];

export const TEAM_STATUSES = {
  ACTIVE: 'Active',
  ON_SITE: 'On-Site',
  OFFLINE: 'Offline',
} as const;

export type TeamStatus = typeof TEAM_STATUSES[keyof typeof TEAM_STATUSES];

export const ARCHIVE_STATUS = 'Archived' as const;

// Workflow sort order (used for Status column sorting)
export const STATUS_SORT_ORDER: Record<JobStatus, number> = {
  Assigned: 1,
  Pending:  2,
  Active:   3,
  Review:   4,
  Verified: 5,
};
