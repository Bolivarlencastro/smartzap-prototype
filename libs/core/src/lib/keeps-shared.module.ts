import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  exports: [CommonModule, FormsModule, ReactiveFormsModule, TranslocoModule],
})
export class KeepsSharedModule {}
