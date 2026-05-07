import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'app/main/courses/model';
import { Report } from 'app/shared/model';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-detail-actions',
  templateUrl: './course-detail-actions.component.html',
  styleUrls: ['./course-detail-actions.component.scss'],
  imports: [MatButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, RouterLink, TranslocoPipe],
})
export class CourseDetailActionsComponent {
  @Input() course!: Course;
  @Input() reportButtons!: Report[];
  @Input() canEdit!: boolean;
  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Output() transfer: EventEmitter<void> = new EventEmitter();
  @Output() edit: EventEmitter<void> = new EventEmitter();
  @Output() publish: EventEmitter<void> = new EventEmitter();
  @Output() generateReport: EventEmitter<string> = new EventEmitter();

  handleRemove(): void {
    this.remove.emit();
  }

  handleTransfer(): void {
    this.transfer.emit();
  }

  handleEdit(): void {
    this.edit.emit();
  }

  handlePublish(): void {
    this.publish.emit();
  }

  handleGenerateReport(type: string): void {
    this.generateReport.emit(type);
  }
}
