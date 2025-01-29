export type Event = {
  id: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  created_at: Date;
};