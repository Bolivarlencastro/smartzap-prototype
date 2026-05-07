import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  imports: [TranslocoPipe],
})
export class ErrorsComponent {}
