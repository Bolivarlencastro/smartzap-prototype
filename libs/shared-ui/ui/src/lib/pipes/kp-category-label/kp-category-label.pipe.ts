import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_CATEGORIES = [
  'all',
  'Communications',
  'Design',
  'Development',
  'Digital Marketing',
  'Entrepreneurship',
  'Finance',
  'Financial Education',
  'Health and Fitness',
  'Language',
  'Leadership',
  'Lifestyle',
  'Management',
  'Marketing',
  'Office Productivity',
  'Personal Development',
  'Project Management',
  'Sales',
  'Social Media',
  'Strategy',
  'Technology',
  'Web Design',
];

const PULSE_CATEGORIES = [
  'PDF',
  'Video',
  'Image',
  'Podcast',
  'Blog',
  'Text',
  'Spreadsheet',
  'Others',
  'Question',
  'Presentation',
  'html',
  'html file',
  'scorm',
];
@Pipe({
  name: 'kpCategoryLabel',
  standalone: true,
})
export class KpCategoryLabelPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }

    if (DEFAULT_CATEGORIES.includes(value)) {
      return 'UI.GENERAL.CATEGORY.' + value;
    }

    if (PULSE_CATEGORIES.includes(value)) {
      return 'UI.GENERAL.CONTENT.' + value.toUpperCase();
    }

    return value;
  }
}
