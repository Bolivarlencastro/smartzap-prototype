import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-select-menu-trigger',
  imports: [MatButton, NgClass, MatIcon],
  templateUrl: './kp-select-menu-trigger.component.html',
  styleUrl: './kp-select-menu-trigger.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class KpSelectMenuTriggerComponent implements AfterContentInit {
  @ContentChild(MatSelect) select: MatSelect;
  @Input() label: string;
  @Input() icon: string;
  @Input() displayCloseButton = true;
  @Input({ transform: booleanAttribute }) disabled: boolean;

  ngAfterContentInit() {
    if (this.select) {
      // We need to set the select panel width to null, so it can fit the options width
      this.select.panelWidth = null;
    }
  }

  get hasSelection() {
    if (this.select?.multiple) {
      return !!(this.select.selected as unknown[]).length;
    }

    return !!this.select?.selected;
  }

  clearSelection() {
    this.select?.ngControl?.reset();
  }
}
