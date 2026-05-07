import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FuseScrollbarModule, FuseScrollResetModule } from '../../../../directives';
import { FuseFullscreenModule, FuseLoadingBarModule, FuseNavigationModule } from '../../../../components';
import { CompactLayoutComponent } from './compact.component';

@NgModule({
  declarations: [CompactLayoutComponent],
  exports: [CompactLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    FuseFullscreenModule,
    FuseLoadingBarModule,
    FuseNavigationModule,
    FuseScrollbarModule,
    FuseScrollResetModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class CompactLayoutModule {}
