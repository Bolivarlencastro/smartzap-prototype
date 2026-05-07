import { ChangeDetectionStrategy, Component, Signal, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Mission, MissionCategory, MissionModel, MissionType } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { MissionInformationFormComponent } from '../../components/forms/mission-information-form/mission-information-form.component';
import { MissionCreationDeactivate } from '../../guards/mission-deactivate.guard';
import { MissionActions, MissionSelectors, TypesSelectors } from '../../store';
import * as fromMissionInfo from '../../store/actions/missions-info.actions';
import { categoriesFeature, cyclesFeature, CategoriesActions } from '@app/shared/store';
import { LanguagesService, LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-mission-info',
  templateUrl: './mission-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionInformationFormComponent, AsyncPipe],
})
export class MissionInfoComponent implements MissionCreationDeactivate, OnInit {
  readonly missionModel$: Observable<MissionModel>;
  readonly missionTypes$: Observable<MissionType[]>;
  readonly categories$: Observable<MissionCategory[]>;
  readonly mission$: Observable<Mission>;
  readonly isNormativeActive$: Observable<boolean>;
  readonly languages: Signal<LanguageTypes[]>;

  @ViewChild('infoForm') infoForm: MissionInformationFormComponent;

  constructor(
    private store: Store,
    private languageService: LanguagesService,
  ) {
    this.store.dispatch(fromMissionInfo.init());

    this.mission$ = this.store.select(MissionSelectors.selectMission);
    this.missionModel$ = this.store.select(MissionSelectors.selectMissionModel);
    this.missionTypes$ = this.store.select(TypesSelectors.selectTypes);
    this.categories$ = this.store.select(categoriesFeature.selectMissions);
    this.isNormativeActive$ = this.store.select(cyclesFeature.selectIsNormativeActive);
    this.languages = this.languageService.languagesTypes;
  }

  ngOnInit(): void {
    this.store.dispatch(CategoriesActions.loadAllMissionCategories());
  }

  saveMission(mission: Partial<Mission>): void {
    this.store.dispatch(MissionActions.saveMission({ mission }));
  }

  canDeactivate(): boolean {
    return !this.infoForm.isDirty;
  }
}
