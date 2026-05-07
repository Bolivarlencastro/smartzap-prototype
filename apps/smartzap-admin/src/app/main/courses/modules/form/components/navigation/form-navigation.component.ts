import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Course } from 'app/main/courses/model';

import { NgClass } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

type CourseFormNavItem = {
  order: number;
  title: string;
  label: string;
  route: any[] | string;
  disabled: boolean;
};

@Component({
  selector: 'app-form-navigation',
  templateUrl: './form-navigation.component.html',
  styleUrls: ['./form-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [NgClass, MatRipple, MatIcon, RouterLinkActive, RouterLink, TranslocoPipe],
})
export class FormNavigationComponent {
  @Input() course!: Course;
  @Input() isInformationCompleted!: boolean;
  @Input() isContentsCompleted!: boolean;

  get navItems(): CourseFormNavItem[] {
    const informationRoute = this.course.id ? ['/', 'courses', this.course.id, 'form'] : '/courses/new/form';
    const imagesRoute = ['/', 'courses', this.course.id, 'form', 'images'];
    const settingsRoute = ['/', 'courses', this.course.id, 'form', 'settings'];
    const contentsRoute = ['/', 'courses', this.course.id, 'form', 'contents'];
    const finishRoute = ['/', 'courses', this.course.id, 'form', 'finish'];

    return [
      {
        order: 1,
        title: 'COURSE.FORM.TABS.INFORMATION',
        label: 'COURSE.FORM.NAVIGATION.INFORMATION',
        route: informationRoute,
        disabled: false,
      },
      {
        order: 2,
        title: 'COURSE.FORM.TABS.IMAGES',
        label: 'COURSE.FORM.NAVIGATION.IMAGES',
        route: imagesRoute,
        disabled: !this.course.id || !this.isInformationCompleted,
      },
      {
        order: 3,
        title: 'COURSE.FORM.TABS.CONFIGURATIONS',
        label: 'COURSE.FORM.NAVIGATION.CONFIGURATIONS',
        route: settingsRoute,
        disabled: !this.course.id || !this.isInformationCompleted,
      },
      {
        order: 4,
        title: 'COURSE.FORM.TABS.CONTENTS',
        label: 'COURSE.FORM.NAVIGATION.CONTENTS',
        route: contentsRoute,
        disabled: !this.course.id || !this.isInformationCompleted,
      },
      {
        order: 5,
        title: 'COURSE.FORM.TABS.FINISH',
        label: 'COURSE.FORM.NAVIGATION.FINISH',
        route: finishRoute,
        disabled: !this.course.id || !this.isContentsCompleted,
      },
    ];
  }
}
