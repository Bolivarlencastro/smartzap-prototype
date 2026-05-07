import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, input, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { MissionModel, MissionStageContent } from 'app/main/mission/mission.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { MissionContentFormService } from '../../services/mission-content-form.service';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpNoHtmlPipe } from '@keeps-platform-frontend-workspace/ui/kp-no-html';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'app-mission-drag-content-list',
  templateUrl: './mission-drag-content-list.component.html',
  styleUrls: ['./mission-drag-content-list.component.scss'],
  animations: fuseAnimations,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslocoPipe,
    KpNoHtmlPipe,
    KpContentIconName,
  ],
})
export class MissionDragContentListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() contents: MissionStageContent[] = [];
  @Input() stageId: string;
  courseModel = input<MissionModel>();
  isScormCourse = computed(() => {
    const courseModel = this.courseModel();
    return courseModel === MissionModel.SCORM;
  });
  private _manageDropEvent: Subject<void>;
  private _subscription: Subscription;

  constructor(private _contentFormService: MissionContentFormService) {
    this._manageDropEvent = new Subject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['contents'] && this.contents) {
      this.contents = [...this.contents];
    }
  }

  canDeleteContent(content: MissionStageContent): boolean {
    if (!content) {
      return false;
    }

    const isScormContent = content.learn_content_type?.name === 'SCORM';
    if (!isScormContent) {
      return true;
    }

    if (this.isScormCourse()) {
      return false;
    }

    return true;
  }

  ngOnInit(): void {
    this._subscription = this._manageDropEvent
      .pipe(
        debounceTime(200),
        map(() => this.updateContentsOrder(this.contents)),
        tap((contents) => this._contentFormService.reorderStageContents(contents, this.stageId)),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  drop(event: CdkDragDrop<MissionStageContent[]>): void {
    const { currentIndex, previousIndex } = event;
    moveItemInArray(this.contents, previousIndex, currentIndex);
    this._manageDropEvent.next();
  }

  onRemoveContent(content: MissionStageContent): void {
    this._contentFormService.removeStageContent(content);
  }

  onEditContent(content: MissionStageContent): void {
    if (content?.learn_content_type?.name === 'Question') {
      this._contentFormService.editQuiz(content);
      return;
    }
    this._contentFormService.editStageContent(content);
  }

  private updateContentsOrder(contents: MissionStageContent[]): MissionStageContent[] {
    return contents.map((content, index) => {
      return { ...content, order: index + 1 };
    });
  }
}
