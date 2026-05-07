import { Pipe, PipeTransform } from '@angular/core';

// Ref.: https://assets.keepsdev.com/icons/keeps/v1/sprite.svg
export const ICONS_MAP: Record<string, string> = {
  pdf: 'document-file-pdf',
  image: 'image',
  video: 'video',
  spreadsheet: 'microsoftexcel',
  podcast: 'mic',
  question: 'quiz',
  presentation: 'microsoftpowerpoint',
  text: 'microsoftword',
  blog: 'educacao',
  html: 'html',
  'html file': 'html',
  scorm: 'scorm',
  'survey question': 'quiz',
};

@Pipe({
  name: 'KpContentIconName',
  standalone: true,
})
export class KpContentIconName implements PipeTransform {
  transform(value?: string): string {
    if (!value) {
      return '';
    }

    const iconName = ICONS_MAP[value.toLowerCase ? value?.toLowerCase() : value];

    if (!iconName) {
      return 'report_problem';
    }

    return iconName;
  }
}
