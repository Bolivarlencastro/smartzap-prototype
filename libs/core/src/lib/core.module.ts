import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CORE_CONFIG, CoreConfig } from './core-config';

@NgModule({
  imports: [CommonModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('Core module is already loaded. Import it in the AppModule only.');
    }
  }

  static forRoot(config: CoreConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [{ provide: CORE_CONFIG, useValue: config }],
    };
  }
}
