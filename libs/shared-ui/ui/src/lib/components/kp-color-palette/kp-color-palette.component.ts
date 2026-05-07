import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_THEMES } from './default-themes';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kp-color-palette',
  templateUrl: './kp-color-palette.component.html',
  styleUrls: ['./kp-color-palette.component.scss'],
  imports: [NgClass, TranslocoPipe],
})
export class KpColorPaletteComponent {
  @Output() colorChanged: EventEmitter<string>;
  @Output() newColor: EventEmitter<string> = new EventEmitter<string>();

  colorPickerOpen = false;

  themes: string[];
  private _selectedTheme: any;

  constructor() {
    this.themes = DEFAULT_THEMES;
    this.colorChanged = new EventEmitter();
  }

  @Input() set selectedTheme(selectedTheme: any) {
    if (selectedTheme) {
      this._selectedTheme = selectedTheme;
    }
  }

  get selectedTheme(): any {
    return this._selectedTheme;
  }

  onChangeTheme(theme: string): void {
    this.selectedTheme = theme;
    this.colorChanged.emit(theme);
  }
}
