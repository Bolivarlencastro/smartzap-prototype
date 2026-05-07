import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroupDirective, FormsModule } from '@angular/forms';
import { Mission, MissionStage } from 'app/main/mission/mission.model';
import { MissionContentFormService } from '../../../services/mission-content-form.service';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatAnchor } from '@angular/material/button';
import { NgClass } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelActionRow,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MissionDragContentListComponent } from '../../mission-drag-content-list/mission-drag-content-list.component';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-content-form',
  templateUrl: './mission-content-form.component.html',
  providers: [MissionContentFormService],
  styles: [
    `
      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .stages-order-boundary.cdk-drop-list-dragging mat-expansion-panel:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatAccordion,
    CdkDropList,
    MatExpansionPanel,
    CdkDrag,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    CdkDragHandle,
    MatTooltip,
    NgClass,
    MissionDragContentListComponent,
    MatExpansionPanelActionRow,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatAnchor,
    RouterLink,
    TranslocoPipe,
  ],
})
export class MissionContentFormComponent {
  @Input() mission!: Mission;
  @Input() stages: MissionStage[] = [];
  @Output() reorderStages = new EventEmitter<MissionStage[]>();

  @ViewChild('formGroupDirective') form: FormGroupDirective;
  stepSelected = 0;

  constructor(private _contentFormService: MissionContentFormService) {}

  onCreateStage(): void {
    const order = this.stages.length + 1;
    this._contentFormService.createStage(this.form.value.name, order, this.mission?.id);
    this.form.resetForm();
    this.stepSelected = this.stages.length;
  }

  onCreateStageContent(stage: MissionStage): void {
    this._contentFormService.createStageContent(stage);
  }

  onRemoveStage(stage: MissionStage): void {
    this._contentFormService.removeStage(stage);
  }

  setStep(index: number): void {
    this.stepSelected = index;
  }

  onEditStage(stage: MissionStage): void {
    this._contentFormService.editStage(stage);
  }

  onStagesReorder(event: CdkDragDrop<MissionStage[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.stages, event.previousIndex, event.currentIndex);
    this.setStep(event.currentIndex);
    this.reorderStages.emit(this.patchStageOrder(this.stages));
  }

  private patchStageOrder(stages: MissionStage[]): MissionStage[] {
    return stages.map((stage, index) => ({ ...stage, order: index + 1 }));
  }

  onClickDescription(event: MouseEvent, stage: MissionStage): void {
    event.stopPropagation();
    this.onEditStage(stage);
  }
}
