import { LearnContent } from '@core/model';
import { Exam } from '@core/model/exam';
import { IMissionStageContent } from '@core/model/stage/mission-stage-content';

export enum MissionAssessmentType {
  FULL = 'FULL',
  CONTENT = 'CONTENT',
  QUIZ = 'QUIZ',
}

export class MissionStageContent implements IMissionStageContent {
  id?: string;
  name: string;
  order: number;
  stage: string;
  content_type: string;
  created_date?: string;
  updated_date?: string;
  content_type_id?: string;
  learn_content_uuid: string;
  description?: string;
  mission?: string;

  constructor(data: any) {
    data = data || {};
    this.id = data.id || '';
    this.name = data.name || '';
    this.learn_content_uuid = data.learn_content_uuid || '';
    this.content_type = data.content_type || '';
    this.order = data.order || '';
    this.created_date = data.created_date || '';
    this.updated_date = data.updated_date || '';
    this.stage = data.stage || '';
    this.description = data.descriprion || '';
    this.mission = data.mission || '';
  }
}

export class ExamMissionStageContent extends MissionStageContent {
  constructor(exam: Exam, order: number, stage: string) {
    super(exam);
    this.id = '';
    this.name = exam.title;
    this.learn_content_uuid = exam.id;
    this.content_type = 'EXAM';
    this.order = order;
    this.stage = stage;
    this.content_type_id = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';
  }
}

export class LearnContentMissionStageContent extends MissionStageContent {
  private readonly genially_content_type_id = 'bda0cca5-ac84-4257-8b83-defac7f96738';

  constructor(learnContent: LearnContent, order: number, stage: string | undefined) {
    super(learnContent);
    this.id = '';
    this.learn_content_uuid = learnContent.id || '';
    this.content_type = learnContent.content_type === this.genially_content_type_id ? 'HTML' : 'CONTENT';
    this.order = order;
    this.stage = stage || '';
    this.content_type_id = learnContent.content_type;
  }
}

export * from './scorm';
