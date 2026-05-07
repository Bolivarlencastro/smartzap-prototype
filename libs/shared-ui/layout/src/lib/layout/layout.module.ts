import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseMediaWatcherModule } from '../services';
import { LayoutComponent } from './layout.component';
import { EmptyLayoutModule } from './layouts/empty/empty.module';
import { ClassicLayoutModule } from './layouts/vertical/classic/classic.module';
import { ClassyLayoutModule } from './layouts/vertical/classy/classy.module';
import { CompactLayoutModule } from './layouts/vertical/compact/compact.module';
import { DenseLayoutModule } from './layouts/vertical/dense/dense.module';
import { FuturisticLayoutModule } from './layouts/vertical/futuristic/futuristic.module';
import { ThinLayoutModule } from './layouts/vertical/thin/thin.module';

const layoutModules = [
  // Empty
  EmptyLayoutModule,

  // Vertical navigation
  ClassicLayoutModule,
  ClassyLayoutModule,
  CompactLayoutModule,
  DenseLayoutModule,
  FuturisticLayoutModule,
  ThinLayoutModule,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FuseMediaWatcherModule, ...layoutModules],
  exports: [LayoutComponent, ...layoutModules],
})
export class FuseLayoutModule {}
