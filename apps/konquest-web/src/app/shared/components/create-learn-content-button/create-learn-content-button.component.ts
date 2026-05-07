import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  CreateLearnContentButtonService,
  CreateLearnContentButtonViewModel,
} from 'app/shared/components/create-learn-content-button/create-learn-content-button.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-learn-content-button',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatDivider,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    RouterLink,
    TranslocoPipe,
    MatTooltipModule,
  ],
  templateUrl: './create-learn-content-button.component.html',
  styles: `
    :host {
      display: flex;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLearnContentButtonComponent {
  protected readonly vm$: Observable<CreateLearnContentButtonViewModel>;

  constructor(private createLearnContentButtonService: CreateLearnContentButtonService) {
    this.vm$ = createLearnContentButtonService.createLearnContentButtonViewModel$;
  }

  createScormCourse() {
    this.createLearnContentButtonService.createScorm();
  }

  createGroup() {
    this.createLearnContentButtonService.createGroup();
  }
}
