export interface Led {
  id: string;
  avatar: string;
  name: string;
  job_position?: string;
  required_progress?: string;
  next_due_date?: string;
  last_activity?: string;
  engagement?: unknown;
  general_status?: unknown;
}
