import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppConfig } from '../../config/fuse-config';
import { FuseConfigService } from './config.service';
import { FUSE_APP_CONFIG } from './config.constants';

@NgModule()
export class FuseConfigModule {
  /**
   * Constructor
   */
  constructor(private _fuseConfigService: FuseConfigService) {}

  /**
   * forRoot method for setting user configuration
   *
   * @param config
   */
  static forRoot(config: AppConfig): ModuleWithProviders<FuseConfigModule> {
    return {
      ngModule: FuseConfigModule,
      providers: [
        {
          provide: FUSE_APP_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
