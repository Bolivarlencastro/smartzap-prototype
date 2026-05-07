import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { defaultConfig } from './config/fuse-config';
import { FuseDirectivesModule } from './directives/directives.module';
import { FuseConfigModule } from './services/config';
import { FuseConfirmationModule } from './services/confirmation';
import { FuseLoadingModule } from './services/loading';
import { FuseMediaWatcherModule } from './services/media-watcher/media-watcher.module';
import { FusePlatformModule } from './services/platform/platform.module';
import { FuseSplashScreenModule } from './services/splash-screen/splash-screen.module';
import { FuseUtilsModule } from './services/utils/utils.module';

@NgModule({
  imports: [
    FuseConfirmationModule,
    FuseLoadingModule,
    FuseMediaWatcherModule,
    FusePlatformModule,
    FuseSplashScreenModule,
    FuseUtilsModule,
    FuseDirectivesModule,
    FuseConfigModule.forRoot(defaultConfig),
  ],
  providers: [
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },
  ],
})
export class FuseModule {
  /**
   * Constructor
   */
  constructor(
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    @Optional() @SkipSelf() parentModule?: FuseModule,
  ) {
    if (parentModule) {
      throw new Error('FuseModule has already been loaded. Import this module in the AppModule only!');
    }

    // Add svg to s3 bucket
    // this._matIconRegistry.addSvgIconSetInNamespace(
    //   'heroicons_outline',
    //   this._domSanitizer.bypassSecurityTrustResourceUrl('libs/layout/src/lib/icons/heroicons-outline.svg')
    // );
  }
}
