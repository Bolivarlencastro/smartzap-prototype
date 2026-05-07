import { Pipe, PipeTransform } from '@angular/core';

export const ICONS_COLOR_MAP: Record<string, string> = {
  pdf: '#FF4D4D',
  image: '#FFB100',
  video: '#FF4D4D',
  spreadsheet: '#00CBAB',
  podcast: '#FF7551',
  question: '#FFB100',
  presentation: '#FF7551',
  text: '#364DFA',
  blog: '#000',
  html: '#000',
  'html file': '#000',
  scorm: '#00CBAB',
};

@Pipe({
  name: 'KpContentIconColor',
  standalone: true,
})
export class KpContentIconColorPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const iconColor = ICONS_COLOR_MAP[value.toLowerCase ? value?.toLowerCase() : value];

    if (!iconColor) {
      return '';
    }

    return iconColor;
  }
}
