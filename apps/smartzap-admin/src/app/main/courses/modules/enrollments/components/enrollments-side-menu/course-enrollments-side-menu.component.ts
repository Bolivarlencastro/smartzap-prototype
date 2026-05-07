import { Component, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { Enrollment } from 'app/main/courses/model';

export interface CourseEnrollmentStats {
  total: number;
  completed: number;
  started: number;
  waiting: number;
  cancelled: number;
  totalSentMessages: number;
  totalPendingMessages: number;
}

export function buildCourseEnrollmentStats(enrollments: Enrollment[], totalCount: number): CourseEnrollmentStats {
  return {
    total: totalCount,
    completed: enrollments.filter((e) => e.status === 'COMPLETED').length,
    started: enrollments.filter((e) => e.status === 'STARTED').length,
    waiting: enrollments.filter((e) => e.status === 'WAITING').length,
    cancelled: enrollments.filter((e) => e.status === 'CANCELLED').length,
    totalSentMessages: enrollments.reduce((sum, e) => sum + (e.messages_sent_count || 0), 0),
    totalPendingMessages: enrollments.reduce((sum, e) => sum + (e.messages_pending_count || 0), 0),
  };
}

@Component({
  selector: 'app-course-enrollments-side-menu',
  template: `
    <div class="h-full w-80 flex flex-col">
      <div class="h-32 pl-8 pr-6 flex items-center">
        <div class="flex flex-col gap-1">
          <span class="mb-2">{{ 'ENROLLMENTS.STATISTICS.TITLE' | transloco }}</span>
          <span class="text-xs">{{ 'ENROLLMENTS.STATISTICS.SUBTITLE' | transloco }}</span>
        </div>
        <button mat-icon-button class="ml-auto" (click)="closeMenu.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="flex-1 pt-6 px-6 flex flex-col gap-3 overflow-y-auto">
        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 text-primary shrink-0">school</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">{{ stats()?.total || 0 }}</span>
            <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.TOTAL' | transloco }}</span>
          </div>
        </div>
        @if (stats()?.completed) {
          <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
            <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="'#01d89b'"></span>
            <div class="flex flex-col leading-tight">
              <span class="font-medium">{{ stats()?.completed }}</span>
              <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.COMPLETED' | transloco }}</span>
            </div>
          </div>
        }
        @if (stats()?.started) {
          <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
            <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="'#293D98'"></span>
            <div class="flex flex-col leading-tight">
              <span class="font-medium">{{ stats()?.started }}</span>
              <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.STARTED' | transloco }}</span>
            </div>
          </div>
        }
        @if (stats()?.waiting) {
          <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
            <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="'#FFB100'"></span>
            <div class="flex flex-col leading-tight">
              <span class="font-medium">{{ stats()?.waiting }}</span>
              <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.WAITING' | transloco }}</span>
            </div>
          </div>
        }
        @if (stats()?.cancelled) {
          <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
            <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="'#b5b5b5'"></span>
            <div class="flex flex-col leading-tight">
              <span class="font-medium">{{ stats()?.cancelled }}</span>
              <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.CANCELLED' | transloco }}</span>
            </div>
          </div>
        }
        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 text-primary shrink-0">send</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">{{ stats()?.totalSentMessages || 0 }}</span>
            <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.TOTAL_SENT_MESSAGES' | transloco }}</span>
          </div>
        </div>
        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 shrink-0">schedule</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">{{ stats()?.totalPendingMessages || 0 }}</span>
            <span class="text-xs opacity-60">{{ 'ENROLLMENTS.STATISTICS.TOTAL_PENDING_MESSAGES' | transloco }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [MatDivider, MatIcon, MatIconButton, TranslocoPipe],
})
export class CourseEnrollmentsSideMenuComponent {
  stats = input<CourseEnrollmentStats | null>(null);
  closeMenu = output<void>();
}
