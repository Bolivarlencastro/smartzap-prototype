import { ChangeDetectionStrategy, Component } from '@angular/core';
import { prototypeNavigation } from '@core/prototype/prototype-fixtures';

@Component({
  selector: 'app-prototype-home',
  templateUrl: './prototype-home.component.html',
  styleUrls: ['./prototype-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PrototypeHomeComponent {
  readonly items = prototypeNavigation;
}
