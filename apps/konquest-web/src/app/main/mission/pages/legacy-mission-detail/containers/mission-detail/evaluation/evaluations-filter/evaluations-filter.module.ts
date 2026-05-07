import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationsFilterComponent } from './evaluations-filter.component';
import { TranslocoModule } from '@jsverse/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';

@NgModule({
  exports: [EvaluationsFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    KpGlobalSearchInputComponent,
    EvaluationsFilterComponent,
  ],
})
export class EvaluationsFilterModule {}
