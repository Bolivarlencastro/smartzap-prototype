import { NgModule } from '@angular/core';
import { FuseInnerScrollDirective } from './inner-scroll.directive';

@NgModule({
  declarations: [FuseInnerScrollDirective],
  exports: [FuseInnerScrollDirective],
})
export class FuseInnerScrollModule {}
