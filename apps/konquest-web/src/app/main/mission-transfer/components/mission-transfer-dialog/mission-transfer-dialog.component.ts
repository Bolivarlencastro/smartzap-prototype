import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeepsUtils, WorkspaceWithUserRoles } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { Mission } from 'app/main/mission/mission.model';
import { TransferDialogFilterRecipient } from 'app/shared/components/transfer-dialog-filter/transfer-dialog-filter-recipient';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { MissionTransferDestinationType, MissionTransferStep } from '../../models';
import { MissionTransferActions, MissionTransferSelectors } from '../../store';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { TransferDialogFilterComponent } from '../../../../shared/components/transfer-dialog-filter/transfer-dialog-filter.component';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-transfer-dialog',
  templateUrl: './mission-transfer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatSelect,
    MatOption,
    MatPrefix,
    TransferDialogFilterComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class MissionTransferDialogComponent implements OnInit, OnDestroy {
  currentStep$!: Observable<MissionTransferStep>;
  selectedMission$!: Observable<Mission | null>;
  selectedRecipient$!: Observable<TransferDialogFilterRecipient | null>;
  filteredRecipients$!: Observable<TransferDialogFilterRecipient[]>;
  positiveButtonLabel$!: Observable<string>;
  negativeButtonLabel$!: Observable<string>;
  showTransferDestinationSelect$!: Observable<boolean>;
  selectedTransferDestinationType$!: Observable<MissionTransferDestinationType | null>;
  showDestinationWorkspaceSelect$!: Observable<boolean>;
  selectedWorkspace$!: Observable<WorkspaceWithUserRoles | null>;
  showUserFilter$!: Observable<boolean>;
  userWorkspaces$!: Observable<WorkspaceWithUserRoles[] | null>;
  isLoading$!: Observable<boolean>;
  subTitle$!: Observable<string>;
  dialogInfo$!: Observable<string>;
  confirmationLabel$!: Observable<string>;
  sameWorkspaceSelectLabel$!: Observable<string>;
  otherWorkspaceSelectLabel$!: Observable<string>;
  title$!: Observable<string>;
  submitDisabled$!: Observable<boolean>;
  recipient$!: Observable<TransferDialogFilterRecipient>;

  MissionTransferStep: typeof MissionTransferStep = MissionTransferStep;
  MissionTransferTargetType: typeof MissionTransferDestinationType = MissionTransferDestinationType;
  defaultCompanyLogo = environment.defaultCompanyLogo;
  recipientFormControl: FormControl<TransferDialogFilterRecipient | null> = new FormControl(null, [
    KeepsUtils.objectKeyValidator('id', true),
  ]);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(MissionTransferActions.loadUserWorkspaces());

    this.currentStep$ = this.store.select(MissionTransferSelectors.selectCurrentStep);
    this.title$ = this.store.select(MissionTransferSelectors.selectDialogTitle);
    this.subTitle$ = this.store.select(MissionTransferSelectors.selectDialogSubtitle);
    this.dialogInfo$ = this.store.select(MissionTransferSelectors.selectDialogInfo);
    this.confirmationLabel$ = this.store.select(MissionTransferSelectors.selectConfirmationLabel);
    this.sameWorkspaceSelectLabel$ = this.store.select(MissionTransferSelectors.selectSameWorkspaceSelectLabel);
    this.otherWorkspaceSelectLabel$ = this.store.select(MissionTransferSelectors.selectOtherWorkspaceSelectLabel);
    this.userWorkspaces$ = this.store.select(MissionTransferSelectors.selectUserWorkspaces);
    this.selectedMission$ = this.store.select(MissionTransferSelectors.selectEdMission);
    this.selectedRecipient$ = this.store.select(MissionTransferSelectors.selectEdRecipient);
    this.filteredRecipients$ = this.store.select(MissionTransferSelectors.selectFilteredRecipients);
    this.positiveButtonLabel$ = this.store.select(MissionTransferSelectors.selectPositiveButtonLabel);
    this.negativeButtonLabel$ = this.store.select(MissionTransferSelectors.selectNegativeButtonLabel);
    this.showTransferDestinationSelect$ = this.store.select(
      MissionTransferSelectors.selectShowTransferDestinationSelector,
    );
    this.selectedTransferDestinationType$ = this.store.select(MissionTransferSelectors.selectEdTransferDestinationType);
    this.showDestinationWorkspaceSelect$ = this.store.select(
      MissionTransferSelectors.selectShowDestinationWorkspaceSelect,
    );
    this.selectedWorkspace$ = this.store.select(MissionTransferSelectors.selectEdWorkspace);
    this.showUserFilter$ = this.store.select(MissionTransferSelectors.selectShowUserFilter);
    this.isLoading$ = this.store.select(MissionTransferSelectors.selectLoading);
    this.submitDisabled$ = this.store.select(MissionTransferSelectors.selectSubmitDisabled);

    this.recipient$ = this.store
      .select(MissionTransferSelectors.selectEdRecipient)
      .pipe(tap((recipient) => this.recipientFormControl.setValue(recipient)));
  }

  ngOnDestroy(): void {
    this.store.dispatch(MissionTransferActions.resetState());
  }

  filterChange(search: string): void {
    this.store.dispatch(MissionTransferActions.filterRecipients({ search }));
  }

  actionButtonClick(positiveButton: boolean): void {
    if (positiveButton) {
      this.store.dispatch(MissionTransferActions.positiveButtonClick());
      return;
    }
    this.store.dispatch(MissionTransferActions.negativeButtonClick());
  }

  autoCompleteOptionSelected(recipient: TransferDialogFilterRecipient): void {
    this.store.dispatch(MissionTransferActions.setRecipient({ recipient }));
  }

  clearRecipient(): void {
    this.store.dispatch(MissionTransferActions.removeRecipient());
  }

  destinationTypeChange(transferDestinationType: MissionTransferDestinationType): void {
    this.recipientFormControl.reset();
    this.store.dispatch(MissionTransferActions.setTransferDestinationType({ transferDestinationType }));
  }

  selectedWorkspaceChange(workspace: WorkspaceWithUserRoles): void {
    this.recipientFormControl.reset();
    this.store.dispatch(MissionTransferActions.setSelectedWorkspace({ workspace }));
  }
}
