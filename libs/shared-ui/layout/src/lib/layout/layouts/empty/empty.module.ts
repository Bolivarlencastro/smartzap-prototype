import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '../../../components';
import { FuseScrollbarModule, FuseScrollResetModule } from '../../../directives';
import { EmptyLayoutComponent } from './empty.component';

@NgModule({
  declarations: [EmptyLayoutComponent],
  imports: [CommonModule, RouterModule, FuseLoadingBarModule, FuseScrollResetModule, FuseScrollbarModule],
  exports: [EmptyLayoutComponent],
})
export class EmptyLayoutModule {}
