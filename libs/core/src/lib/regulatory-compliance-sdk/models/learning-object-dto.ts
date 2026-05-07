export enum LEARNING_OBJECT_TYPE_ID {
  MISSION = '798e50d7-8b97-4979-8728-4f9f1599bb05',
  TRAIL = 'd841e9d8-d669-4d88-9636-1072765d0738',
}

export interface LearningObjectDto {
  id: string;
  name: string;
  learningObjectTypeId: LEARNING_OBJECT_TYPE_ID;
}
