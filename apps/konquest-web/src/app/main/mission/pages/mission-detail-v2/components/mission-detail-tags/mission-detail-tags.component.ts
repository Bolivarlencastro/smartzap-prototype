import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  MatChipInputEvent,
  MatChipGrid,
  MatChipRow,
  MatChipRemove,
  MatChipInput,
  MatChipListbox,
  MatChipOption,
} from '@angular/material/chips';
import { MissionTag } from 'app/main/mission/mission.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-detail-tags',
  templateUrl: './mission-detail-tags.component.html',
  imports: [
    NgxSkeletonLoaderModule,
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatChipRemove,
    MatChipInput,
    MatChipListbox,
    MatChipOption,
    TranslocoPipe,
  ],
})
export class MissionDetailTagsComponent {
  @Input() tags!: MissionTag[];
  @Input() isEnabled!: boolean;
  @Output() removeTag = new EventEmitter<MissionTag>();
  @Output() addTag = new EventEmitter<string | string[]>();
  @Input() loading: boolean;
  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  protected readonly loaderTheme = {
    'border-radius': '4px',
    width: '70px',
    height: '30px',
  };

  add(event: MatChipInputEvent): void {
    const input = event.chipInput;
    const value = event.value;

    // Add tag
    if ((value || '').trim()) {
      this.addTag.emit(value);
    }

    // Reset the input value
    if (input) {
      input.clear();
    }
  }

  remove(tag: MissionTag): void {
    this.removeTag.emit(tag);
  }

  bulkTagCreation(): void {
    const value = this.chipInput.nativeElement.value.replace(/,/g, ';');
    if (!value.includes(';')) {
      return;
    }

    const tags: string[] = value.split(';').reduce((accumulator: string[], tag: string) => {
      tag = tag.trim();
      if (tag) {
        accumulator.push(tag);
      }
      return accumulator;
    }, []);

    this.addTag.emit(tags);
    this.chipInput.nativeElement.value = '';
  }
}
