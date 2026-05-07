import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerNavItemComponent } from './components/inner-nav-item/inner-nav-item.component';
import { InnerNavComponent } from './inner-nav.component';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    MatTabsModule,
    MatDividerModule,
    MatRipple,
    InnerNavItemComponent,
    InnerNavComponent,
  ],
  exports: [InnerNavComponent],
})
export class InnerNavModule {}
