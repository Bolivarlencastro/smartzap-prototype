import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

type ViewMode = 'view' | 'edit';

@Component({
  selector: 'kp-editable',
  templateUrl: './kp-editable.component.html',
  styleUrls: ['kp-editable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckbox, FormsModule, ReactiveFormsModule, MatIconButton, MatIcon],
})
export class KpEditableComponent {
  @Input() viewMode: ViewMode = 'view';
  @Input() checked: boolean;
  @Input() value: string;
  @Output() savedChanges = new EventEmitter<string>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() checkedChange = new EventEmitter<boolean>();

  @ViewChild('editInput') editInput: ElementRef<HTMLInputElement>;

  get isViewMode(): boolean {
    return this.viewMode === 'view';
  }

  @HostBinding('class.edit-mode')
  get isEditMode() {
    return !this.isViewMode;
  }

  constructor(private _cdr: ChangeDetectorRef) {}

  protected readonly formControl = new FormControl<string>('', [Validators.required, Validators.minLength(1)]);

  toggleEditMode() {
    if (this.viewMode === 'view') {
      this.enterEditMode();
      return;
    }

    this.enterViewMode();
  }

  onDelete() {
    this.deleteItem.emit();
  }

  saveChanges() {
    if (this.formControl.invalid) {
      return;
    }

    const value = this.formControl.value;
    this.savedChanges.emit(value);
    this.value = value;
    this.enterViewMode();
  }

  private enterEditMode(): void {
    this.viewMode = 'edit';
    this.formControl.setValue(this.value);
    this._cdr.detectChanges();
    this.editInput.nativeElement.focus();
  }

  private enterViewMode(): void {
    this.viewMode = 'view';
    this._cdr.detectChanges();
  }

  onCheckChange(event: MatCheckboxChange) {
    this.checkedChange.emit(event.checked);
  }
}
