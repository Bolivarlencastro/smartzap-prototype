export type Event = {
  event_id: string;
  event_name: string;
  event_status: string;
  start_date: string | null;
  end_date: string | null;
  enrolled_count: number;
  attended_count: number | null;
  attendance_rate: number | null;
};
