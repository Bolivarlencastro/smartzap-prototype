import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FuseFullscreenModule, FuseLoadingBarModule, FuseNavigationModule } from '../../../../components';
import { FuseScrollbarModule, FuseScrollResetModule } from '../../../../directives';
import { MaterialLayoutComponent } from './material.component';
import { EnterpriseLayoutModule } from '../enterprise/enterprise.module';

@NgModule({
  declarations: [MaterialLayoutComponent],
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
    EnterpriseLayoutModule,
  ],
  providers: [provideHttpClient()],
  exports: [MaterialLayoutComponent],
})
export class MaterialLayoutModule {}
