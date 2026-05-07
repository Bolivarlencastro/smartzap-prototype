export class CreateActivity {
  private currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }

  get type() {
    return 'CREATE';
  }

  get start() {
    return this.currentDate;
  }

  get stop() {
    return this.currentDate;
  }
}

export class UpateActivity {
  get type() {
    return 'UPDATE';
  }

  get start() {
    return '';
  }

  get stop() {
    return new Date();
  }
}

export const TIME_INTERVAEL = 5000;
export const TIME_TO_DISABLE = 60000 * 3; // 3 min aproximadamente

export enum ActivityContentTypes {
  Podcast = 'Podcast',
  Video = 'Video',
  Image = 'Image',
  PDF = 'PDF',
  Text = 'Text',
  Presentation = 'Presentation',
  Spreadsheet = 'Spreadsheet',
  Blog = 'Blog',
  Question = 'Question',
}

export interface Tracker {
  contentId: string;
  contentType: ActivityContentTypes;
  event: any;
}
