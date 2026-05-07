import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { User } from '@core/model';
import {
  CustomCertificateDto,
  LearnContentCertificateChange,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { Group } from 'app/main/group/groups/group.model';
import { Mission, MissionModel } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { MissionAutocompleteItem } from '../../components/mission-autocomplete/mission-autocomplete-item';
import {
  ContributorsSelectors,
  GroupsSelectors,
  MissionActions,
  MissionContributorsActions,
  MissionGroupsActions,
  MissionSelectors,
} from '../../store';
import {
  CertificateLearnContentFacade,
  NewCertificateDialogFacade,
} from '@keeps-platform-frontend-workspace/custom-certificates';
import { MissionFormHeaderComponent } from '../../components/mission-form-header/mission-form-header.component';
import { MissionSettingsFormComponent } from '../../components/forms/mission-settings-form/mission-settings-form.component';
import { MissionAutocompleteComponent } from '../../components/mission-autocomplete/mission-autocomplete.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

const SETTINGS_SUBTITLE_MAP = [
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.SETTINGS'),
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.GROUPS'),
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.CONTRIBUTORS'),
];

const SETTINGS_SUBTITLE_EVENT_MAP = [
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.SETTINGS_EVENT'),
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.GROUPS_EVENT'),
  marker('MISSION.CREATE.NAVIGATION.SUBTITLE.SETTINGS.CONTRIBUTORS_EVENT'),
];

@Component({
  selector: 'app-mission-settings',
  templateUrl: './mission-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MissionFormHeaderComponent,
    MatTabGroup,
    MatTab,
    MissionSettingsFormComponent,
    MissionAutocompleteComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class MissionSettingsComponent {
  protected readonly mission$: Observable<Mission>;
  protected readonly missionModel$: Observable<MissionModel>;
  protected readonly missionGroups$: Observable<MissionAutocompleteItem[]>;
  protected readonly missionContributors$: Observable<MissionAutocompleteItem[]>;
  protected readonly filteredGroups$: Observable<Group[]>;
  protected readonly filteredUsers$: Observable<User[]>;
  protected readonly certificates$: Observable<CustomCertificateDto[]>;
  protected readonly learnContentCertificate$: Observable<CustomCertificateDto>;
  protected readonly isIntegrationMission$: Observable<boolean>;
  protected readonly isEventMission$: Observable<boolean>;
  protected readonly isContentCreator: boolean;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private readonly store: Store,
    private readonly newCertificateDialogFacade: NewCertificateDialogFacade,
    private readonly certificateLearnContentFacade: CertificateLearnContentFacade,
    private readonly userProfileService: UserProfileService,
  ) {
    this.mission$ = store.select(MissionSelectors.selectMission);
    this.missionModel$ = store.select(MissionSelectors.selectMissionModel);
    this.missionContributors$ = store.select(ContributorsSelectors.selectContributorsUser);
    this.missionGroups$ = store.select(GroupsSelectors.selectGroupsWithId);
    this.filteredGroups$ = store.select(GroupsSelectors.selectFilteredGroups);
    this.filteredUsers$ = store.select(ContributorsSelectors.selectFilteredUsers);
    this.isIntegrationMission$ = store.select(MissionSelectors.selectIsIntegrationMission);
    this.learnContentCertificate$ = this.certificateLearnContentFacade.learnContentCertificate$;
    this.certificates$ = certificateLearnContentFacade.certificates$;

    this.isEventMission$ = store.select(MissionSelectors.selectIsEvent);
    this.isContentCreator = this.userProfileService.hasRoles(['content']);

    if (!this.isContentCreator) {
      this.certificateLearnContentFacade.loadCertificatesForLearnContent('mission');
    }
  }

  previewCertificate(certificate: CustomCertificateDto): void {
    this.certificateLearnContentFacade.previewCertificate(certificate);
  }

  createCertificate(): void {
    this.newCertificateDialogFacade.newCertificate();
  }

  getHeaderSubTitle(index: number, isEventMission: boolean): string {
    if (isEventMission) {
      return SETTINGS_SUBTITLE_EVENT_MAP[index];
    }
    return SETTINGS_SUBTITLE_MAP[index];
  }

  filterGroups(searchTerm: string): void {
    this.store.dispatch(MissionGroupsActions.filterGroups({ filter: searchTerm }));
  }

  addGroup(group: MissionAutocompleteItem): void {
    this.store.dispatch(MissionGroupsActions.addGroup({ group }));
  }

  removeGroup(group: MissionAutocompleteItem): void {
    this.store.dispatch(MissionGroupsActions.removeGroup({ group }));
  }

  filterContributors(searchTerm: string): void {
    this.store.dispatch(MissionContributorsActions.filterUsers({ filter: searchTerm }));
  }

  addContributor(contributor: MissionAutocompleteItem): void {
    this.store.dispatch(MissionContributorsActions.addContributor({ contributor }));
  }

  removeContributor(contributor: MissionAutocompleteItem): void {
    this.store.dispatch(MissionContributorsActions.removeContributor({ userId: contributor.id }));
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

    this.tabGroup.selectedIndex = currentTab + 1;
  }

  formChange(mission: Partial<Mission>): void {
    this.store.dispatch(MissionActions.saveMission({ mission, skipNavigation: true }));
  }

  certificateChange(event: LearnContentCertificateChange) {
    this.certificateLearnContentFacade.saveLearnContentCertificate(event);
  }
}
