import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';

export interface GroupMission {
  id: string;
  created_date: Date;
  updated_date: Date;

  group: string;

  mission: {
    id: string;
    created_date: Date;
    updated_date: Date;

    description: string;
    development_status: string;
    duration_time: string;
    holder_image: string;
    is_active: true;
    mission_category: string;
    mission_type: string;
    name: string;
    points: string;
    summary: string;
    thumb_image: string;
    user_creator: string;
    is_integration: boolean;
  };
}

export interface GroupMissionActionData {
  groupId: string;
  missionIds: string[];
  enrollment?: EnrollmentConfig;
}
