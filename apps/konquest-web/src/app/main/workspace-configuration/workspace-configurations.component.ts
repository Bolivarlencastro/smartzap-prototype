import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  GamificationActions,
  gamificationFeature,
  MissionListingConfigActions,
  missionListingConfigFeature,
} from '@app/shared/store';
import { ModuleService } from '@core/model/workspace-configuration.model';
import {
  GamificationItem,
  MissionListingConfig,
  UserProfileService,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import * as fromActions from './store/workspace-configurations.actions';
import * as fromSelectors from './store/workspace-configurations.selectors';
import { WorkspaceKonquestSettings } from '@core/model';
import { AsyncPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButton } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';

const MISSION_SERVICE_ID = '0d3752f0-15d7-402a-8628-04ed47bcbf41';

@Component({
  selector: 'app-workspace-configurations',
  templateUrl: './workspace-configurations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    MatTooltip,
    MatDivider,
    MatFormField,
    MatInput,
    NgxMaskDirective,
    MatHint,
    MatButton,
    NgxSkeletonLoaderModule,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class WorkspaceConfigurationsComponent implements OnDestroy, OnInit {
  static readonly MAX_VALUE = 100;
  static readonly MIN_VALUE = 0;

  workspaceConfigurations$: Observable<{ services: ModuleService[]; settings: WorkspaceKonquestSettings }>;
  isLoading$: Observable<boolean>;
  allowListPublicCategories$: Observable<boolean>;
  gamificationSubModules$: Observable<Partial<GamificationItem>[]>;
  isGamificationActive$: Observable<boolean>;
  isSuperAdmin$: Observable<boolean>;
  blockReEnrollment$: Observable<boolean>;
  missionListingConfig$: Observable<Partial<MissionListingConfig>[]>;

  @ViewChild('categoriesSlideToggle')
  categoriesSlideToggle!: MatSlideToggle;
  services: ModuleService[] = [];
  configurationFormGroup: UntypedFormGroup;

  private workspace: WorkspaceWithServices;
  private _unsubscribeAll = new Subject();
  protected readonly featureFlags = environment.featureFlags;
  private readonly GAMIFICATION_ID = environment.apps.konquest.services.gamification.id;

  get displayMissionListingConfig(): boolean {
    return this.featureFlags['mission-listing-config'] && this.configurationFormGroup?.get(MISSION_SERVICE_ID)?.value;
  }

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private store: Store,
    private _workspaceService: WorkspaceService,
    private _dialog: MatDialog,
    private _userProfileService: UserProfileService,
  ) {
    if (this.featureFlags['gamification']) {
      this.store.dispatch(GamificationActions.loadGamification());
    }

    this.workspace = this._workspaceService.getCurrentWorkspace();
    this.isLoading$ = this.store
      .select(fromSelectors.selectIsLoading)
      .pipe(tap({ next: (isLoading) => this.toggleFromEnabledStatus(!isLoading) }));
    this.allowListPublicCategories$ = this.store.select(fromSelectors.selectAllowListPublicCategories);
    this.isSuperAdmin$ = this._userProfileService.isSuperAdmin$();
    this.blockReEnrollment$ = this.store.select(fromSelectors.selectBlockReEnrollment);

    this.configurationFormGroup = this.buildForm(_formBuilder);

    this.workspaceConfigurations$ = this.store.select(fromSelectors.selectWorkspaceConfigurations).pipe(
      filter(({ services }) => !!services.length),
      tap(({ services, settings }) => this.configureWorkspaceForm(services, settings)),
    );

    this.gamificationSubModules$ = this.store
      .select(gamificationFeature.selectGamificationSubModules)
      .pipe(tap((data) => this.patchGamificationForm(data)));

    this.isGamificationActive$ = this.store.select(gamificationFeature.selectIsGamificationActive);
    this.missionListingConfig$ = this.store.select(missionListingConfigFeature.selectConfig);

    this.configurePassMarkInput();
    this.configureGoalDateInput();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this.store.dispatch(fromActions.clearWorkspaceConfigurations());
  }

  ngOnInit(): void {
    const workspace = this._workspaceService.getCurrentWorkspace();
    this.store.dispatch(fromActions.workspaceInit({ workspaceId: workspace?.id || '' }));
  }

  onSubmit() {
    const workspace = this._workspaceService.getCurrentWorkspace();
    const value = this.configurationFormGroup.get('passMark')?.value;
    this.store.dispatch(fromActions.savePassMark({ workspaceId: workspace?.id || '', passMark: value }));
  }

  onDisableDefaultCategories({ checked }: MatSlideToggleChange) {
    const { id } = this._workspaceService.getCurrentWorkspace() || {};
    const settings = { allow_list_public_categories: checked } as any;

    if (checked) {
      this.store.dispatch(fromActions.updateWorkspaceGeneralSettings({ id: id || '', settings }));
      return;
    }

    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = marker('WORKSPACE_CONFIGURATIONS.MESSAGES.DISABLE_CATEGORIES_TITLE');
    dialogRef.componentInstance.confirmMessage = marker('WORKSPACE_CONFIGURATIONS.MESSAGES.DISABLE_CATEGORIES');
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DEACTIVATE';
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.categoriesSlideToggle.checked = true;
        return;
      }
      this.store.dispatch(fromActions.updateWorkspaceGeneralSettings({ id: id || '', settings }));
    });
  }

  onToggleBlockReEnrollment({ checked }: MatSlideToggleChange): void {
    const { id } = this._workspaceService.getCurrentWorkspace() || {};
    const settings = { block_reenrollment: checked } as any;
    this.store.dispatch(fromActions.updateWorkspaceGeneralSettings({ id: id || '', settings }));
  }

  updateServiceToggle(service: ModuleService, status: boolean): void {
    this.store.dispatch(
      fromActions.changeServiceStatus({
        workspaceId: this.workspace?.id || '',
        service,
        status,
      }),
    );
  }

  updateGamificationSubModuleToggle(item: GamificationItem, value: boolean): void {
    this.store.dispatch(GamificationActions.updateGamificationSubModules({ item, value }));
  }

  updateMissionListingConfig(config: Partial<MissionListingConfig>, { checked }: MatSlideToggleChange): void {
    this.store.dispatch(MissionListingConfigActions.updateConfig({ config, checked }));
  }

  private configureWorkspaceForm(services: ModuleService[], settings: WorkspaceKonquestSettings): void {
    if (!this.featureFlags['gamification']) {
      services = services.filter((service) => service.field !== this.GAMIFICATION_ID);
    }

    this.services = this.includeTemporaryTooltip(services);
    this.patchWorkspaceForm(
      services,
      settings.min_performance_certificate * 100 || 0,
      settings.enrollment_goal_duration_days,
    );
  }

  private includeTemporaryTooltip(services: ModuleService[]): ModuleService[] {
    const sectionServiceId = '8d572fd1-cca9-4979-9e72-f3871ac8ee97';

    return services.map((service) => {
      if (service.field === sectionServiceId) {
        return { ...service, tooltip: 'WORKSPACE_CONFIGURATIONS.MODULES.BETA_TEST' };
      }

      return service;
    });
  }

  private buildForm(formBuilder: FormBuilder): UntypedFormGroup {
    return formBuilder.group({
      passMark: new FormControl(null),
      goal_date: new FormControl(null),
      ranking_general: new FormControl(false),
      // ranking_multiplier: new FormControl(false),
      ranking_director: new FormControl(false),
      ranking_manager: new FormControl(false),
      ranking_activity_area: new FormControl(false),
      ranking_leader: new FormControl(false),
    });
  }

  private patchWorkspaceForm(services: ModuleService[], passMark: number, goal_date: number): void {
    services.forEach((service) => {
      const control = this.configurationFormGroup.get(service.field);
      if (control) {
        control.setValue(service.status, { emitEvent: false });
      } else {
        this.configurationFormGroup.addControl(service.field, new FormControl(service.status), { emitEvent: false });
      }
    });
    this.configurationFormGroup.get('passMark').setValue(passMark, { emitEvent: false });
    this.configurationFormGroup.get('goal_date').setValue(goal_date, { emitEvent: false });
  }

  private configurePassMarkInput(): void {
    this.configurationFormGroup
      .get('passMark')
      ?.valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        tap((value) => this.setPassMark(value)),
      )
      .subscribe();
  }

  private configureGoalDateInput(): void {
    this.configurationFormGroup
      .get('goal_date')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => !!value),
        takeUntil(this._unsubscribeAll),
        tap((value) => {
          const { id } = this._workspaceService.getCurrentWorkspace();
          this.store.dispatch(fromActions.updateWorkspaceGoalDate({ id, goal_date: value }));
        }),
      )
      .subscribe();
  }

  private setPassMark(value: number) {
    let currentValue = WorkspaceConfigurationsComponent.MIN_VALUE;

    if (value > WorkspaceConfigurationsComponent.MAX_VALUE) {
      currentValue = WorkspaceConfigurationsComponent.MAX_VALUE;
    }

    if (value > WorkspaceConfigurationsComponent.MIN_VALUE && value <= WorkspaceConfigurationsComponent.MAX_VALUE) {
      currentValue = value;
    }

    if (currentValue !== this.configurationFormGroup.get('passMark')?.value) {
      this.configurationFormGroup.get('passMark')?.setValue(currentValue);
    }
  }

  private patchGamificationForm(subModules: Partial<GamificationItem>[]): void {
    subModules.forEach((subModule) => {
      const control = this.configurationFormGroup.get(subModule.field);
      if (control) {
        control.setValue(subModule.status);
        if (subModule.can_enable) {
          control.enable();
        } else {
          control.disable();
        }
      }
    });
  }

  private toggleFromEnabledStatus(enable: boolean) {
    if (enable) {
      this.configurationFormGroup?.enable();
      return;
    }

    this.configurationFormGroup?.disable();
  }
}
