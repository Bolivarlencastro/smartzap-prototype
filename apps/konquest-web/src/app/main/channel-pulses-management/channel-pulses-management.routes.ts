import { importProvidersFrom } from '@angular/core';
import { LearnContentAPI } from '@core/api/learn-content.api';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PulseQuizService } from '@core/api/pulse-quiz.service';
import { ChannelPulsesManagementComponent } from './channel-pulses-management.component';
import { ChannelPulsesManagementService } from './services/channel-pulses-management.service';
import { ChannelPulsesCreateService } from './services/channel-pulses-create.service';
import { ChannelPulsesManagementEffects } from './store/effects';
import { channelPulsesManagementFeature } from './store/features';

export default [
  {
    path: ':channelId',
    component: ChannelPulsesManagementComponent,
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(channelPulsesManagementFeature),
        EffectsModule.forFeature([ChannelPulsesManagementEffects]),
      ]),
      ChannelPulsesManagementService,
      ChannelPulsesCreateService,
      LearnContentAPI,
      PulseQuizService,
    ],
  },
];
