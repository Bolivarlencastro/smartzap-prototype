export interface Group {
  channels?: number;
  workspace?: string;
  learning_trails?: number;
  created_date?: Date;
  description?: string;
  id: string;
  missions?: number;
  name: string;
  updated_date?: Date;
  users?: number;
  is_integration?: boolean;
}

export type ImportType = 'USER' | 'MISSION' | 'CHANNEL' | 'TRAIL';
