import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardActions } from 'app/main/dashboard/store';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { KonquestFeaturesService } from 'app/shared/services';
import { environment } from 'environments/environment';

const MISSIONS_SERVICE_ID = environment.apps.konquest.services.mission.id;
const PULSES_SERVICE_ID = environment.apps.konquest.services.pulse.id;
const TRAILS_SERVICE_ID = environment.apps.konquest.services.learning_trail.id;
const EVENTS_SERVICE_ID = environment.apps.konquest.services.event.id;

@Injectable()
export class DashboardEffects {
  loadPriorityMission$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadPriorityMission),
      switchMap(() =>
        this.dashboardService.fetchPriorityMission().pipe(
          map((result) => DashboardActions.loadPriorityMissionSuccess({ result })),
          catchError(() => of(DashboardActions.loadPriorityMissionFailure())),
        ),
      ),
    );
  });

  setActiveFeatures$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard),
      map(() => {
        const missionsActive = this.konquestFeatureServices.isServiceActive(MISSIONS_SERVICE_ID);
        const trailsActive = this.konquestFeatureServices.isServiceActive(TRAILS_SERVICE_ID);
        const pulsesActive = this.konquestFeatureServices.isServiceActive(PULSES_SERVICE_ID);
        const eventsActive = this.konquestFeatureServices.isServiceActive(EVENTS_SERVICE_ID);
        return DashboardActions.setDashboardActiveFeatures({
          missionsActive,
          trailsActive,
          pulsesActive,
          eventsActive,
        });
      }),
    );
  });

  loadTrailRecommendation$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadTrailRecommendations),
      filter(() => this.konquestFeatureServices.isServiceActive(TRAILS_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchTrailRecommendations().pipe(
          map((results) => DashboardActions.loadTrailRecommendationsSuccess({ results })),
          catchError(() => of(DashboardActions.loadTrailRecommendationsFailure())),
        ),
      ),
    );
  });

  loadMissionRecommendation$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadMissionRecommendations),
      filter(() => this.konquestFeatureServices.isServiceActive(MISSIONS_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchMissionRecommendations().pipe(
          map((results) => DashboardActions.loadMissionRecommendationsSuccess({ results })),
          catchError(() => of(DashboardActions.loadMissionRecommendationsFailure())),
        ),
      ),
    );
  });

  loadMissionEnrollments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadMissionEnrollments),
      filter(() => this.konquestFeatureServices.isServiceActive(MISSIONS_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchMissionEnrollments().pipe(
          map((results) => DashboardActions.loadMissionEnrollmentsSuccess({ results })),
          catchError(() => of(DashboardActions.loadMissionEnrollmentsFailure())),
        ),
      ),
    );
  });

  loadEvents$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadEvents),
      filter(() => this.konquestFeatureServices.isServiceActive(MISSIONS_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchEvents().pipe(
          map((results) => DashboardActions.loadEventsSuccess({ results })),
          catchError(() => of(DashboardActions.loadMissionEnrollmentsFailure())),
        ),
      ),
    );
  });

  loadPulses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadPulses),
      filter(() => this.konquestFeatureServices.isServiceActive(PULSES_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchPulsesRecomendations().pipe(
          map((results) => DashboardActions.loadPulsesSuccess({ payload: results })),
          catchError(() => of(DashboardActions.loadPulsesError())),
        ),
      ),
    );
  });

  loadChannels$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.loadDashboard, DashboardActions.loadChannels),
      filter(() => this.konquestFeatureServices.isServiceActive(PULSES_SERVICE_ID)),
      switchMap(() =>
        this.dashboardService.fetchChannels().pipe(
          map((results) => DashboardActions.loadChannelsSuccess({ payload: results })),
          catchError(() => of(DashboardActions.loadMissionRecommendationsFailure())),
        ),
      ),
    );
  });

  goToChannel$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(DashboardActions.goToChannel),
        map(({ id }) => this.dashboardService.navigateToChannel(id)),
      );
    },
    { dispatch: false },
  );
  goToPulse$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(DashboardActions.goToPulse),
        map(({ id, pulse_type }) => this.dashboardService.navigateToPulse(id, pulse_type)),
      );
    },
    { dispatch: false },
  );

  addPulseBookmark$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.addPulseBookMark),
      mergeMap(({ pulse }) => {
        return this.dashboardService.postPulseBookmark(pulse.id).pipe(
          map((bookmark) => {
            return DashboardActions.addPulseBookmarkSuccess({
              payload: { ...pulse, bookmark_id: bookmark.id },
            });
          }),
          catchError((error) => of(DashboardActions.addPulseBookmarkFailure({ error }))),
        );
      }),
    );
  });
  removePulseBookmark$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.removePulseBookMark),
      mergeMap(({ pulse }) => {
        return this.dashboardService.deletePulseBookmark(pulse.bookmark_id).pipe(
          map(() => {
            return DashboardActions.removePulseBookmarkSuccess({
              payload: { ...pulse, bookmark_id: undefined },
            });
          }),
          catchError((error) => of(DashboardActions.removePulseBookmarkFailure({ error }))),
        );
      }),
    );
  });

  unsubscribeFromChannel$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.unsubscribeFromChannel),
      mergeMap(({ channel }) => {
        return this.dashboardService.deleteChannelSubscriptions(channel.subscription_id).pipe(
          map(() => {
            return DashboardActions.unsubscribeFromChannelSuccess({
              payload: { ...channel, subscription_id: undefined },
            });
          }),
          catchError((error) => of(DashboardActions.removePulseBookmarkFailure({ error }))),
        );
      }),
    );
  });

  subscribeToChannel$ = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.subscribeToChannel),
      mergeMap(({ channel }) => {
        return this.dashboardService.postChannelSubscription(channel.id).pipe(
          map((subscription) => {
            return DashboardActions.subscribeToChannelSuccess({
              payload: { ...channel, subscription_id: subscription.id },
            });
          }),
          catchError((error) => of(DashboardActions.addPulseBookmarkFailure({ error }))),
        );
      }),
    );
  });

  constructor(
    private actions: Actions,
    private dashboardService: DashboardService,
    private konquestFeatureServices: KonquestFeaturesService,
  ) {}
}
