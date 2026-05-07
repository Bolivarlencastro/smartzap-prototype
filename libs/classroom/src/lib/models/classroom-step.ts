import { STEP_CONTENT_TYPE } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface ClassroomStep {
  id: string;
  name: string;
  description: string;
  stepType: STEP_CONTENT_TYPE;
  completed: boolean;
  order: number | string;
  learn_content_id?: string;
  isCurrent?: boolean;
  progress?: number;
  parentStageId?: string;
  nextStepId?: string;
  prevStepId?: string;
  skippedByUser?: boolean;
  childrenSteps?: ClassroomStep[];
}
