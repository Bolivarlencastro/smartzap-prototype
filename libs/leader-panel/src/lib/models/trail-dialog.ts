import { Enrollment } from './enrollment';
import { Trail } from './trail';

export interface TrailDialogViewModel {
  trail: Trail;
  loading: boolean;
  data: TrailDialogData;
}

export interface TrailDialogData {
  enrollments: TrailDialogEnrollment[];
  notEnrolled: TrailDialogUser[];
  courseOnTrails: TrailDialogLearnContent[];
  pulseOnTrails: TrailDialogLearnContent[];
}

export interface TrailDialogUser {
  id: string;
  name: string;
  avatar: string;
  jobPosition: string;
}

export interface TrailDialogLearnContent {
  id: string;
  name: string;
  learn_content_type: 'course' | 'trail' | 'pulse';
  progress: number;
  performance?: number;
  duration?: number;
}

export type TrailDialogEnrollment = Partial<Enrollment> & TrailDialogUser;
