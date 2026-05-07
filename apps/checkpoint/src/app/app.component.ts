import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckInService } from './services/check-in.service';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'cp-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, DatePipe, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class AppComponent {
  readonly sessionData = this.checkInService.sessionData;

  constructor(private readonly checkInService: CheckInService) {}
}
