import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import {
  Mission,
  MissionInstructor,
  MissionLive,
  MissionModel,
  MissionPresential,
} from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { LivePresentialFormComponent } from '../../components/forms/live-presential-form/live-presential-form.component';
import { MissionAutocompleteItem } from '../../components/mission-autocomplete/mission-autocomplete-item';
import { MissionCreationDeactivate } from '../../guards/mission-deactivate.guard';
import { InstructorsSelectors, MissionActions, MissionInstructorsActions, MissionSelectors } from '../../store';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionFormHeaderComponent } from '../../components/mission-form-header/mission-form-header.component';
import { MissionAutocompleteComponent } from '../../components/mission-autocomplete/mission-autocomplete.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

const SUBTITLE_MAP = [
  'MISSION.CREATE.NAVIGATION.SUBTITLE.FILL_ALL_FIELDS',
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.INSTRUCTORS'),
];

@Component({
  selector: 'app-mission-presential-live',
  templateUrl: './mission-presential-live.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MissionFormHeaderComponent,
    MatTabGroup,
    MatTab,
    LivePresentialFormComponent,
    MissionAutocompleteComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class MissionPresentialLiveComponent implements MissionCreationDeactivate {
  protected readonly missionInstructors$: Observable<MissionInstructor[]>;
  protected readonly filteredInstructors$: Observable<MissionInstructor[]>;
  protected readonly missionModel$: Observable<MissionModel>;
  protected readonly missionModelInfo$: Observable<MissionLive | MissionPresential>;
  protected readonly missionDevelopmentStatus$: Observable<DevelopmentStatus>;
  protected readonly title$: Observable<string>;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('presentialLiveForm') presentialLiveForm: LivePresentialFormComponent;

  getHeaderSubTitle(index: number): string {
    return SUBTITLE_MAP[index];
  }

  get nextDisabled() {
    return this.presentialLiveForm?.invalid && this.tabGroup?.selectedIndex === 0;
  }

  constructor(private store: Store) {
    this.missionInstructors$ = this.store.select(InstructorsSelectors.selectInstructors);
    this.filteredInstructors$ = this.store.select(InstructorsSelectors.selectFilteredInstructors);
    this.missionModelInfo$ = this.store.select(MissionSelectors.selectPresentialLiveInfo);
    this.missionModel$ = this.store.select(MissionSelectors.selectMissionModel);
    this.title$ = this.store.select(MissionSelectors.selectPresentialLiveTitle);
    this.missionDevelopmentStatus$ = this.store.select(MissionSelectors.selectMissionDevelopmentStatus);
  }

  filterInstructors(filter: string): void {
    this.store.dispatch(MissionInstructorsActions.filterInstructors({ filter }));
  }

  addInstructor(instructor: MissionAutocompleteItem): void {
    this.store.dispatch(MissionInstructorsActions.addInstructor({ instructor }));
  }

  removeInstructor(instructor: MissionAutocompleteItem): void {
    this.store.dispatch(MissionInstructorsActions.removeInstructor({ instructor }));
  }

  registerNewInstructor() {
    this.store.dispatch(MissionInstructorsActions.openNewInstructorDialog());
  }

  previous(): void {
    const currentTab = this.tabGroup.selectedIndex;

    if (currentTab === 0) {
      this.store.dispatch(MissionActions.previousStep());
      return;
    }

    this.tabGroup.selectedIndex = currentTab - 1;
  }

  next(): void {
    const currentTab = this.tabGroup.selectedIndex;
    const isLastTab = this.tabGroup._allTabs.length - 1 === currentTab;

    if (isLastTab) {
      this.store.dispatch(MissionActions.nextStep());
      return;
    }

    if (currentTab === 0) {
      this.save();
    }

    this.tabGroup.selectedIndex = currentTab + 1;
  }

  canDeactivate(): boolean {
    return !this.presentialLiveForm.isDirty;
  }

  private save(): void {
    const presentialLiveInfo = this.presentialLiveForm.getFormValue();
    const missionModelInfo = 'url' in presentialLiveInfo ? 'live' : 'presential';

    const mission: Partial<Mission> = { [missionModelInfo]: { ...presentialLiveInfo } };
    delete mission[missionModelInfo].dates;

    this.store.dispatch(
      MissionActions.saveCompleteMission({
        mission,
        dates: presentialLiveInfo.dates,
        skipNavigation: true,
      }),
    );
  }
}
