import { Component, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { categoriesFeature } from '@app/shared/store';
import { Category } from '@core/model/category.model';
import { LanguagesService, LanguageTypes, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { Channel, ChannelCardInfo, ChannelCategory, ChannelType } from '../../channel.model';
import * as ChannelTypesSelectors from '../../store/channel-types/channel-types.selectors';
import * as ChannelSelectors from '../../store/channel/channel.selectors';
import { ChannelFormActions } from './store/actions';
import { ChannelFormSelectors } from './store/selectors';
import { selectIsLoadedAndSubmitted } from './store/selectors/channel-form.selectors';
import { KpContentBoxComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-box';
import { AsyncPipe, LowerCasePipe } from '@angular/common';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ChannelFormCoverComponent } from './components/channel-form-cover/channel-form-cover.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';

const EDIT = marker('CHANNEL.FORM.EDIT');
const NEW = marker('CHANNEL.FORM.NEW');

@Component({
  selector: 'channel-form',
  templateUrl: './channel-form.component.html',
  imports: [
    KpContentBoxComponent,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatStepper,
    MatStep,
    MatStepLabel,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSelect,
    MatOption,
    KpLanguageColorTagComponent,
    MatSlideToggle,
    MatAnchor,
    MatButton,
    ChannelFormCoverComponent,
    AsyncPipe,
    LowerCasePipe,
    TranslocoPipe,
    KpCategoryLabelPipe,
  ],
})
export class ChannelFormComponent implements OnInit, OnDestroy {
  stepperTitle!: string;

  channel$: Observable<Channel | undefined>;
  channelCardInfo$: Observable<ChannelCardInfo>;

  isSubmitted$: Observable<boolean>;

  channel: Channel = {
    id: '',
    language: '',
  };
  channelIsLoading$: Observable<boolean>;
  channelTypes$: Observable<ChannelType[] | undefined | null>;
  channelCategories$: Observable<ChannelCategory[]>;

  informationFormGroup: UntypedFormGroup;
  protected readonly languages: Signal<LanguageTypes[]>;

  private _unsubscribe: Subject<any>;

  @ViewChild('stepper', { static: true }) stepperRef!: MatStepper;

  constructor(
    public _dialog: MatDialog,
    public _messageService: KpMessageService,
    public _workspaceService: WorkspaceService,
    public _route: ActivatedRoute,
    private store: Store,
    private _fuseLoadingService: FuseLoadingService,
    private _formBuilder: UntypedFormBuilder,
    private _languagesService: LanguagesService,
  ) {
    this._unsubscribe = new Subject();
    this.languages = this._languagesService.languagesTypes;

    this.channel$ = this.store.select(ChannelFormSelectors.selectChannelForm);
    this.channelCardInfo$ = this.store.select(ChannelFormSelectors.selectChannelCardInfo);
    this.channelTypes$ = this.store.select(ChannelTypesSelectors.selectChannelTypes);
    this.channelCategories$ = this.store.select(categoriesFeature.selectChannels);

    this.channelIsLoading$ = this.store.select(ChannelSelectors.selectChannelLoading);

    this.isSubmitted$ = this.store.select(selectIsLoadedAndSubmitted).pipe(
      filter((loadedAndSubmitted) => loadedAndSubmitted),
      tap(() => this.stepperRef && setTimeout(() => this.stepperRef.next())),
    );

    this.informationFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
      channel_category: ['', Validators.required],
      channel_type: ['', Validators.required],
      description: ['', Validators.required],
      language: ['', Validators.required],
      is_active: [true],
    });

    this._route.params
      .pipe(
        map((params) => params['id']),
        takeUntil(this._unsubscribe),
      )
      .subscribe((id) => (this.stepperTitle = id ? EDIT : NEW));
  }

  ngOnInit(): void {
    this.channel$
      .pipe(
        tap((channel) => {
          if (!channel) {
            return;
          }

          this.channel = channel;

          this.informationFormGroup.patchValue({
            name: this.channel.name,
            channel_category: this.channel.channel_category,
            channel_type: this.channel.channel_type?.id,
            description: this.channel.description,
            is_active: this.channel.is_active,
            language: this.channel.language,
          });
        }),
        takeUntil(this._unsubscribe),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe.unsubscribe();

    this.store.dispatch(ChannelFormActions.getChannelReset());
  }

  compareCategories(categoryA: Category, categoryB: Category): boolean {
    return categoryA.name == categoryB.name;
  }

  onSubmit(): void {
    if (this.informationFormGroup.pristine) {
      this.stepperRef.next();
    } else {
      const id = this.channel?.id || null;
      this.store.dispatch(ChannelFormActions.submit({ id, channel: this.getChannel() }));
    }
  }

  onCoverChange(file: File): void {
    if (!file) {
      return;
    }

    const { id = null } = this.channel;

    this._fuseLoadingService.show();
    this.store.dispatch(ChannelFormActions.getChannelCover({ image: file, id: id || '', channel: this.getChannel() }));
  }

  onFinish(): void {
    this.store.dispatch(ChannelFormActions.goToChannel());
  }

  private getChannel(): Channel {
    const { id: workspace = null } = this._workspaceService.getCurrentWorkspace() || {};
    const formData = this.informationFormGroup.getRawValue();
    return {
      ...this.channel,
      ...formData,
      name: formData.name?.trim(),
      workspace,
      channel_category: formData.channel_category.id,
    };
  }
}
