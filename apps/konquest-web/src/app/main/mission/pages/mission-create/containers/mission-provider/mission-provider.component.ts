import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExternalMission, Mission, MissionProvider } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { MissionProviderFormComponent } from '../../components/forms/mission-provider-form/mission-provider-form.component';
import { MissionCreationDeactivate } from '../../guards/mission-deactivate.guard';
import { MissionActions, MissionProvidersActions, MissionSelectors, ProvidersSelectors } from '../../store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-mission-provider',
  templateUrl: './mission-provider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionProviderFormComponent, AsyncPipe],
})
export class MissionProviderComponent implements MissionCreationDeactivate {
  protected readonly providers$: Observable<MissionProvider[]>;
  protected readonly mission$: Observable<Mission>;

  @ViewChild('providerForm') providerForm: MissionProviderFormComponent;

  constructor(private store: Store) {
    this.providers$ = this.store.select(ProvidersSelectors.selectProviders);
    this.mission$ = this.store.select(MissionSelectors.selectMission);
    this.searchProvider('');
  }

  saveMission(mission: Partial<Mission>): void {
    const provider = mission.provider as MissionProvider;

    const externalInfo: ExternalMission = {
      course_url: mission.external_course_url,
      provider: provider.id,
    };

    this.store.dispatch(MissionActions.saveMission({ mission: { ...mission, external: externalInfo } }));
  }

  canDeactivate(): boolean {
    return !this.providerForm.isDirty;
  }

  previous() {
    this.store.dispatch(MissionActions.previousStep());
  }

  next() {
    this.store.dispatch(MissionActions.nextStep());
  }

  searchProvider(filter: string) {
    this.store.dispatch(MissionProvidersActions.filterProviders({ filter }));
  }
}
