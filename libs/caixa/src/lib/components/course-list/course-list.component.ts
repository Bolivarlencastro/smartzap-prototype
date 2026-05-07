import { Component, input, output } from '@angular/core';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { CardAction, CardActionId } from '../../models';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'cx-course-list',
  imports: [KpLearnContentCardComponent, NgxSkeletonLoaderModule],
  styles: `
    .courses-container {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 480px) {
      .courses-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1280px) {
      .courses-container {
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
      }
    }

    .course-card {
      width: initial !important;
      height: initial !important;
      background-color: #0b2c65 !important;
    }

    ngx-skeleton-loader {
      --mat-sys-surface-container-high: #0b2c65;
    }
  `,
  template: `
    <div class="courses-container">
      @if (loading()) {
        @for (index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; track index) {
          <ngx-skeleton-loader count="1" animation="progress-dark" [theme]="loaderTheme"></ngx-skeleton-loader>
        }
      } @else {
        @for (course of courses(); track course.contentId) {
          <kp-learn-content-card
            class="course-card"
            [learnContent]="course"
            [actions]="course.actions"
            (cardAction)="onCardAction($event, course.contentId)"
            (click)="onCardAction('details', course.contentId)"
          ></kp-learn-content-card>
        }
      }
    </div>
  `,
})
export class CourseListComponent {
  courses = input<LearnContentCardData[]>();
  loading = input(true);
  action = output<CardAction>();

  protected readonly loaderTheme = {
    'border-radius': '12px',
    height: '100%',
    'aspect-ratio': '9/16',
    background: '#0b2c65',
    display: 'block',
  };

  onCardAction(actionId: CardActionId, courseId: string) {
    this.action.emit({ actionId, courseId });
  }
}
