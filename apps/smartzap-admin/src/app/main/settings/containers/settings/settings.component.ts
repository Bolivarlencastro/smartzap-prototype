import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [RouterOutlet],
  host: { class: 'block h-full' },
})
export class SettingsComponent {}
