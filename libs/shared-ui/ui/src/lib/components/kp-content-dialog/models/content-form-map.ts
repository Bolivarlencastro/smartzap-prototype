import { Validators } from '@angular/forms';

export const URL_REGEX = /^https?:\/\/[\w.-]+(?:\.[\w-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;
export const YOUTUBE_REGEX =
  /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
export const VIMEO_REGEX =
  /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(?:channels\/\w+\/|groups\/[^/]*\/videos\/|video\/)?(\d+)/;
export const SOUNDCLOUD_REGEX =
  /((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-.]+(\/)+[a-zA-Z0-9\-.]+/;
export const GOOGLE_DRIVE_REGEX =
  /((https:)?\/\/(docs.google.com)\/(presentation|document|spreadsheets)\/d\/[a-zA-Z0-9_-]+\/(.*))/;
export const GENIALLY_REGEX = /(https)?:\/\/(view\.genial\.ly\/|view\.genially\.com\/)[a-zA-Z0-9_-]+/;
export const H5P_REGEX = /(https)?:\/\/(h5p\.org\/h5p\/embed\/)[a-zA-Z0-9_-]+/;

const nameFieldValidators: Validators[] = [Validators.required, Validators.maxLength(200), Validators.pattern(/\S/)];

export const ContentFormMap: Record<string, unknown> = {
  FILE: {
    type: 'FILE',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required]],
  },
  QUIZ: {
    type: 'QUIZ',
    name: ['', [...nameFieldValidators, Validators.maxLength(100)]],
    value: [''],
  },
  EVALUATIVE_QUIZ: {
    type: 'EVALUATIVE_QUIZ',
    name: ['', [...nameFieldValidators, Validators.maxLength(100)]],
    value: [''],
  },
  SURVEY_QUIZ: {
    type: 'SURVEY_QUIZ',
    name: ['', [...nameFieldValidators, Validators.maxLength(100)]],
    value: [''],
  },
  LINK: {
    type: 'LINK',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(URL_REGEX)]],
  },
  YOUTUBE: {
    type: 'YOUTUBE',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(YOUTUBE_REGEX)]],
  },
  VIMEO: {
    type: 'VIMEO',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(VIMEO_REGEX)]],
  },
  SOUNDCLOUD: {
    type: 'SOUNDCLOUD',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(SOUNDCLOUD_REGEX)]],
  },
  GOOGLE_DRIVE: {
    type: 'GOOGLE_DRIVE',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(GOOGLE_DRIVE_REGEX)]],
  },
  GENIALLY: {
    type: 'GENIALLY',
    name: '',
    description: '',
    value: ['', [Validators.pattern(GENIALLY_REGEX)]],
    time: ['', [Validators.required, Validators.min(1)]],
  },
  H5P: {
    type: 'H5P',
    name: '',
    description: '',
    value: ['', [Validators.pattern(H5P_REGEX)]],
    time: ['', [Validators.required, Validators.min(1)]],
  },
  HTML: {
    type: 'HTML',
    name: ['', nameFieldValidators],
    description: '',
    value: ['', [Validators.required, Validators.pattern(URL_REGEX)]],
    time: ['', [Validators.required, Validators.min(1)]],
  },
  SCORM: {
    type: 'SCORM',
    name: '',
    description: '',
    value: ['', [Validators.required]],
    time: ['', [Validators.required, Validators.min(1)]],
  },
};
