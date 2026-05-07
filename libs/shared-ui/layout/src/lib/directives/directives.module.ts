import { NgModule } from '@angular/core';
import { FuseInnerScrollModule } from './inner-scroll';
import { FuseScrollResetModule } from './scroll-reset';
import { FuseScrollbarModule } from './scrollbar';

@NgModule({
  imports: [FuseInnerScrollModule, FuseScrollbarModule, FuseScrollResetModule],
})
export class FuseDirectivesModule {}
