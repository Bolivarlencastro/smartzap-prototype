import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from '../../../model';
import { CourseSelectors, LessonsSelectors } from '../../../store/selectors';
import { FormNavigationComponent } from '../components/navigation/form-navigation.component';

const slider = trigger('routeAnimations', [
  transition('* => isLeft', slideTo('left')),
  transition('* => isRight', slideTo('right')),
  transition('isLeft => *', slideTo('right')),
  transition('isRight => *', slideTo('left')),
]);

function slideTo(direction: string): any[] {
  const optional = { optional: true };
  return [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          width: '100%',
          [direction]: 0,
        }),
      ],
      optional,
    ),
    query(':enter', [style({ [direction]: '-100%' })], optional),
    group([
      query(':leave', [animate('600ms ease', style({ [direction]: '100%' }))], optional),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))], optional),
    ]),
  ];
}

@Component({
  selector: 'app-course-form',
  template: ` @if (course$ | async; as course) {
    <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-hidden">
      <mat-drawer-container class="flex-auto sm:h-full">
        <mat-drawer mode="side" opened>
          <div class="py-6 px-9">
            <h2 class="text-2xl font-black mb-2">
              {{ 'COURSE.FORM.TITLE.' + (!!course.id ? 'EDIT' : 'NEW') | transloco }}
            </h2>
            <p>{{ 'COURSE.FORM.NAVIGATION.SUBTITLE' | transloco }}</p>
          </div>
          <app-form-navigation
            [course]="course"
            [isInformationCompleted]="isInformationCompleted$ | async"
            [isContentsCompleted]="isContentsCompleted$ | async"
          ></app-form-navigation>
        </mat-drawer>
        <mat-drawer-content class="p-12">
          <router-outlet #outlet="outlet"></router-outlet>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  }`,
  animations: [slider],
  styleUrls: ['./course-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormNavigationComponent,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    RouterOutlet,
    TranslocoPipe,
  ],
})
export class CourseFormComponent implements OnInit {
  course$!: Observable<Course>;
  isInformationCompleted$!: Observable<boolean>;
  isContentsCompleted$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.course$ = this.store.select(CourseSelectors.selectCourse);
    this.isInformationCompleted$ = this.store.select(CourseSelectors.selectIsInformationFormCompleted);
    this.isContentsCompleted$ = this.store.select(LessonsSelectors.selectIsContentsFormCompleted);
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet?.activatedRouteData?.['animation'];
  }
}
