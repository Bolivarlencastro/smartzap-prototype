import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FuseFullscreenModule, FuseLoadingBarModule, FuseNavigationModule } from '../../../../components';
import { FuseScrollbarModule, FuseScrollResetModule } from '../../../../directives/';
import { DenseLayoutComponent } from './dense.component';

@NgModule({
  declarations: [DenseLayoutComponent],
  exports: [DenseLayoutComponent],
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
    FuseScrollResetModule,
    FuseScrollbarModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class DenseLayoutModule {}
