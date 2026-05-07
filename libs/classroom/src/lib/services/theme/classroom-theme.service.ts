import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { ThemeType } from '../../models';

@Injectable({ providedIn: 'root' })
export class ClassroomThemeService {
  static readonly CLASSROOM_THEME = 'CLASSROOM_THEME';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  getClassroomTheme(): ThemeType {
    return JSON.parse(localStorage.getItem(ClassroomThemeService.CLASSROOM_THEME));
  }

  setClassroomTheme(theme: ThemeType) {
    localStorage.setItem(ClassroomThemeService.CLASSROOM_THEME, JSON.stringify(theme));
    this.setTheme(theme);
  }

  getTheme(): ThemeType {
    const htmlElement = this.document.documentElement;
    return (htmlElement?.style?.colorScheme || 'light') as ThemeType;
  }

  getThemeOnToggle(theme: ThemeType): ThemeType {
    return theme === 'light' ? 'dark' : 'light';
  }

  setTheme(theme: ThemeType) {
    const htmlElement = this.document.documentElement;
    htmlElement.style.colorScheme = theme;
  }
}
