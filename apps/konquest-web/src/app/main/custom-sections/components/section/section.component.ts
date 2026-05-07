import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { MenuContentsComponent } from '../../containers/menu-contents/menu-contents.component';
import {
  CustomSectionContentsModel,
  CustomSectionModel,
  DeleteContentModel,
  LearningObjectType,
} from '../../models/custom-sections';

@Component({
  selector: 'app-section',
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    MatDividerModule,
    MenuContentsComponent,
    KpCardTagComponent,
    MatTooltipModule,
    NgClass,
  ],
  template: `
    <div class="bg-default rounded-lg border border-default w-full cursor-move">
      <div class="flex items-center w-full p-6 h-24">
        <mat-icon class="mr-6">{{ section().icon }}</mat-icon>
        <div class="flex flex-col gap-1 justify-center mr-3">
          <div class="flex items-center gap-2">
            <span class="text-xl line-clamp-1">{{ section().title }}</span>
            @if (!section()?.enabled) {
              <kp-card-tag
                class="shrink-0"
                [textOnly]="true"
                type="disabled-section"
                [matTooltip]="'CUSTOM_SECTIONS.LIST.DISABLED_SECTION_TOOLTIP' | transloco"
              ></kp-card-tag>
            }
          </div>
          <span class="text-sm line-clamp-1">{{ section().description }}</span>
        </div>

        <div class="flex items-center ml-auto gap-1 mr-2">
          <mat-icon>event</mat-icon>
          <span class="text-xs text-nowrap">{{
            section().formattedDate || 'CUSTOM_SECTIONS.LIST.NO_SCHEDULE' | transloco
          }}</span>
        </div>

        <button mat-icon-button (click)="onDeleteSection()">
          <mat-icon>delete</mat-icon>
        </button>

        <button mat-icon-button (click)="onEditSection()">
          <mat-icon>edit</mat-icon>
        </button>

        <mat-icon>drag_indicator</mat-icon>
      </div>

      <mat-divider class="mx-4"></mat-divider>

      <div class="flex gap-2 p-4 w-full text-sm flex-wrap">
        @if (noContentMessage()) {
          <div class="mx-auto font-bold">{{ noContentMessage() | transloco }}</div>
        } @else {
          @for (content of section().contents; track content.id) {
            <div
              class="text-xs flex items-center border border-default rounded-lg px-2 h-8"
              [ngClass]="{ 'opacity-50': !section()?.enabled }"
            >
              <mat-icon class="s-5 mr-2">{{ content.icon }}</mat-icon>
              <div>{{ content.name }}</div>
              <mat-icon
                class="ml-3 s-5"
                (click)="onDeleteContent(content)"
                [ngClass]="{ 'cursor-pointer': section()?.enabled }"
                >close</mat-icon
              >
            </div>
          }
          <app-menu-contents [section]="section()"></app-menu-contents>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  section = input<CustomSectionModel>();
  deleteSection = output<string>();
  editSection = output<CustomSectionModel>();
  deleteContent = output<DeleteContentModel>();

  protected readonly noContentMessage = computed(() => this.getNoContentMessage());

  onDeleteSection() {
    this.deleteSection.emit(this.section().id);
  }

  onEditSection() {
    this.editSection.emit(this.section());
  }

  onDeleteContent(content: CustomSectionContentsModel) {
    this.deleteContent.emit({ section: this.section(), content });
  }

  private getNoContentMessage() {
    const type = this.section()?.learning_object_type;
    const typesWithoutMessage: LearningObjectType[] = [
      'HIGHLIGHT.LEARNING_TRAIL',
      'HIGHLIGHT.COURSE',
      'HIGHLIGHT.EVENTS',
      'LEARNING_TRAIL',
      'COURSE',
    ];

    if (!type || typesWithoutMessage.includes(type)) {
      return null;
    }

    const MESSAGES_MAP: Partial<Record<LearningObjectType, string>> = {
      'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': 'CUSTOM_SECTIONS.LIST.CONTENTS.TRAIL_ENROLLMENTS',
      'LEARNING_TRAIL.ENROLLED': 'CUSTOM_SECTIONS.LIST.CONTENTS.TRAIL_ENROLLMENTS',
      'HIGHLIGHT.COURSE.ENROLLED': 'CUSTOM_SECTIONS.LIST.CONTENTS.COURSE_ENROLLMENTS',
      'COURSE.ENROLLED': 'CUSTOM_SECTIONS.LIST.CONTENTS.COURSE_ENROLLMENTS',
      'HIGHLIGHT.EVENTS.ENROLLED': 'CUSTOM_SECTIONS.LIST.CONTENTS.EVENT_ENROLLMENTS',
      'LEARNING_TRAIL.ALL': 'CUSTOM_SECTIONS.LIST.CONTENTS.ALL_TRAILS',
      'COURSE.ALL': 'CUSTOM_SECTIONS.LIST.CONTENTS.ALL_COURSES',
    };

    return MESSAGES_MAP[type];
  }
}
