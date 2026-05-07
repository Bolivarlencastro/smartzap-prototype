import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'kp-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe],
})
export class ColorPickerComponent {
  @ViewChild('colorPickerInput') colorPickerInput: ElementRef<HTMLInputElement>;
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();

  @HostListener('click')
  onClickDocument(): void {
    this.colorPickerInput.nativeElement.click();
  }

  onChangeColor(value: string): void {
    this.color = value;
    this.colorChange.emit(value);
  }
}
