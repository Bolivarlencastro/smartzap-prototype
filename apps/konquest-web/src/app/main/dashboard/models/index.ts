import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';

export type DashboardViewModel = {
  loadingPriorityMission: boolean;
  loadingMissionEnrollments: boolean;
  loadingMissionRecommendations: boolean;
  loadingTrailRecommendations: boolean;
  loadingEvents: boolean;
  loadingPulses: boolean;
  loadingChannel: boolean;
  missionRecommendations: LearnContentCardData[];
  trailRecommendations: LearnContentCardData[];
  priorityMission: LearnContentCardData[];
  missionEnrollments: LearnContentCardData[];
  events: LearnContentCardData[];
  eventsActive: boolean;
  pulses: PulseCardDto[];
  channels: KpChannelCardModel[];
  missionsActive: boolean;
  trailsActive: boolean;
  pulsesActive: boolean;
};
