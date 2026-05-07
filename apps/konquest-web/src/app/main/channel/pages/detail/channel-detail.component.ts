import { Component, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PulseService } from '@core/api';
import { Pagination, PaginationParams, User } from '@core/model';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { KpPulseCardComponent, PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { KpUploadDialogComponent, KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { Store } from '@ngrx/store';
import { TransferContentType, TransferDialogData } from 'app/main/transfer-dialog/models';
import { TransferDialogActions } from 'app/main/transfer-dialog/store/actions';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import * as TransferSelectors from '../../../transfer-dialog/store/selectors/selectors';

import { Channel, ChannelComment, ChannelSubscription, ChannelSubscriptionsFilters } from '../../channel.model';
import { ChannelDetailService } from './channel-detail.service';
import {
  ChannelDetailActions,
  ChannelDetailCommentActions,
  ChannelDetailPulsesActions,
  ChannelDetailSubscriptionsActions,
} from './store/actions';

import { BreakpointObserver } from '@angular/cdk/layout';
import { ContributorsDialogContentType } from 'app/shared/components/contributors-dialog/models/contributors-dialog-content.type';
import { ContributorDialogActions } from 'app/shared/components/contributors-dialog/store';

import { ChannelDetailCommentSelectors, ChannelDetailPulsesSelectors, ChannelDetailSelectors } from './store/selectors';
import { VinculateToGroupActions } from '@app/shared/store';
import { PulseUploadService } from './pulse-upload.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AsyncPipe, LowerCasePipe, NgTemplateOutlet } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCard } from '@angular/material/card';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { KpCommentsComponent } from '@keeps-platform-frontend-workspace/ui/kp-comments';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { navigateToPulse } from '@app/shared/services';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.scss'],
  animations: fuseAnimations,
  imports: [
    InfiniteScrollDirective,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatDivider,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    NgTemplateOutlet,
    MatMenuItem,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTabGroup,
    MatTab,
    KpPulseCardComponent,
    NgxSkeletonLoaderModule,
    MatCard,
    KpEditorComponent,
    KpCommentsComponent,
    KpUploadDialogComponent,
    AsyncPipe,
    LowerCasePipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class ChannelDetailComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  private _unsubscribeAll: Subject<any>;
  readonly defaultUserAvatar = environment.defaultUserAvatar;

  rating!: number;
  ratingTotal!: number;

  channel$: Observable<Channel>;
  channel!: Channel;
  channelLoaded$: Observable<boolean>;
  channelTypeIcon!: 'lock' | 'lock_open';
  channelTypeLabel!: string;

  comment: any;
  commentLoaded$: Observable<boolean>;

  comments: any;
  comments$: Observable<any>;
  commentsIsLoading$: Observable<boolean>;
  commentsNextPage?: string | null;
  commentsFinished?: boolean;

  transferCurrentUser$: Observable<string>;

  pulses$: Observable<PulseCardDto[]>;
  pulsesIsLoading$: Observable<boolean>;
  noPulses$: Observable<boolean>;
  subscribers$: Observable<any[]>;

  contributors$: Observable<User[]>;
  isMobile$: Observable<boolean>;

  userId = this._authService.userId;
  users?: User[] | null = null;
  channelId!: string;
  selectedTabIndex: number;
  isContributor = false;
  isContentCreator: boolean;
  isSuperAdmin: boolean;
  canDeleteAnyComment: boolean;

  get canCreateOrEditPulse(): boolean {
    return this.isOwner || this.isContributor || this.isSuperAdmin;
  }

  get canEditContributors(): boolean {
    return this.isOwner || this.isSuperAdmin;
  }

  get isOwnerSuperAdmin(): boolean {
    return this.isOwner || this.isSuperAdmin;
  }

  get canTransfer(): boolean {
    return this.isOwnerSuperAdmin || this.isContentCreator;
  }

  get canSubscribe(): boolean {
    return !this.isOwner && !this.isContributor;
  }

  @ViewChild('uploadDialog', { static: true })
  uploadDialogComponent!: KpUploadDialogComponent;

  readonly uploads: Signal<KpUploadDialogItem[]>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private store: Store,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
    private _pulseService: PulseService,
    private _dialog: MatDialog,
    private _channelDetailService: ChannelDetailService,
    private _breakpointObserver: BreakpointObserver,
    private _pulseUploadService: PulseUploadService,
  ) {
    this._unsubscribeAll = new Subject();
    this.channel$ = this.store.select(ChannelDetailSelectors.selectChannelDetail);
    this.channelLoaded$ = this.store.select(ChannelDetailSelectors.selectChannelDetailLoaded);
    this.commentLoaded$ = this.store.select(ChannelDetailCommentSelectors.selectPostChannelCommentLoaded);
    this.comments$ = this.store.select(ChannelDetailCommentSelectors.selectChannelComments);
    this.commentsIsLoading$ = this.store.select(ChannelDetailCommentSelectors.selectChannelCommentsLoading);
    this.pulses$ = this.store.select(ChannelDetailPulsesSelectors.selectChannelPulses);
    this.noPulses$ = this.store.select(ChannelDetailPulsesSelectors.selectPulsesEmpty);
    this.pulsesIsLoading$ = this.store.select(ChannelDetailPulsesSelectors.selectChannelPulsesLoading);
    this.transferCurrentUser$ = this.store.select(TransferSelectors.selectCurrentUser);
    this.contributors$ = this.store.select(ChannelDetailSelectors.selectChannelContributors);
    this.subscribers$ = this.store.select(ChannelDetailSelectors.selectChannelSubscribers);
    this.isContentCreator = this._userProfileService.isCurator();
    this.isSuperAdmin = this._userProfileService.isSuperAdmin();
    this.canDeleteAnyComment = this.isContentCreator || this.isSuperAdmin;
    this.uploads = this._pulseUploadService.displayedUploads;

    this.selectedTabIndex = 0;

    this._route.params
      .pipe(
        map((params) => params['id']),
        filter((id) => !!id),
        tap((id) => {
          this.channelId = id;
          this.store.dispatch(ChannelDetailActions.getChannelSubscribers({ channel_id: id }));
        }),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.channel$.subscribe((channel) => {
      if (!channel) {
        return;
      }

      this.channel = channel;
      this.rating = channel.rating_avg || 0;
      this.ratingTotal = channel.rating_count || 0;
      this.channelTypeIcon = channel.channel_type.name === 'Open For Workspace' ? 'lock_open' : 'lock';
      this.channelTypeLabel = `GENERAL.CHANNEL-TYPE.${channel.channel_type.name}`;
      this.isContributor = channel.is_contributor;
    });

    this.comments$.subscribe((comments: Pagination<ChannelComment>) => {
      if (!comments) {
        this.commentsNextPage = null;
        this.commentsFinished = false;
        return;
      }

      const { results, started, finished, next }: Pagination<ChannelComment> = comments;
      this.commentsNextPage = next;
      this.commentsFinished = finished;

      if (started || !this.comments) {
        this.comments = results;
      } else {
        this.comments = this.comments.concat(results);
      }
    });

    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._pulseUploadService.clearUploads();
    this.store.dispatch(ChannelDetailActions.resetState());
  }

  get isOwner(): boolean {
    return this.channel.user_creator?.id === this.userId;
  }

  postComment(comment: string): void {
    const { id } = this.channel;

    if (id) {
      const payload: ChannelComment = {
        comment,
        channel: id,
        user: this.userId || '',
      };

      this.comment = '';

      this.store.dispatch(ChannelDetailCommentActions.postChannelComment({ payload }));
    }
  }

  toPulse(pulse: PulseCardDto | undefined): void {
    if (!pulse) {
      return;
    }

    navigateToPulse(this._router, pulse.id);
  }

  onChangeTab({ index }: MatTabChangeEvent): void {
    this.selectedTabIndex = index;
  }

  onScroll(): void {
    if (!this.selectedTabIndex) {
      this.onScrollPulses();
      return;
    }

    this.onScrollComments();
  }

  onScrollPulses(): void {
    this.store.dispatch(ChannelDetailPulsesActions.loadMorePulses());
  }

  onScrollComments(): void {
    if (this.commentsFinished) {
      return;
    }

    const { id } = this.channel;
    const payload = {
      channel_id: id,
    };

    const paginationParams: PaginationParams = {
      finished: this.commentsFinished,
      nextPage: this.commentsNextPage,
    };

    this.store.dispatch(
      ChannelDetailCommentActions.getChannelCommentsPagination({
        payload,
        paginationParams,
      }),
    );
  }

  onChannelEdit(channel: Channel): void {
    const { id } = channel;
    this._router.navigate(['/', 'channels', 'edit', id]);
  }

  onChannelContributors(): void {
    this.store.dispatch(
      ContributorDialogActions.openDialog({
        relatedContentId: this.channelId,
        contentType: ContributorsDialogContentType.CHANNEL,
      }),
    );
  }

  onChannelDelete(channel: Channel): void {
    const { id } = channel;
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', maxWidth: '350px' });

    dialogRef.componentInstance.confirmTitle = 'CHANNEL.DETAIL.CONFIRM.DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'CHANNEL.DETAIL.CONFIRM.DELETE_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(ChannelDetailActions.deleteChannel({ channel_id: id }))),
      )
      .subscribe();
  }

  onChannelTransfer({ id, name }: Channel): void {
    const transferCurrentUserSubscription = this.transferCurrentUser$
      .pipe(filter((currentUser?: string) => !!currentUser))
      .subscribe(() => {
        this.store.dispatch(ChannelDetailActions.getChannel({ channel_id: this.channelId }));
        transferCurrentUserSubscription.unsubscribe();
      });

    const dialogData: TransferDialogData = {
      contentType: TransferContentType.CHANNEL,
      transferContent: { id, name },
    };
    this.store.dispatch(TransferDialogActions.openDialog({ dialogData }));
  }

  onEditComment(data: { new_comment: string; comment: { id: string; channel: Channel; user: User } }): void {
    const {
      new_comment,
      comment: {
        id,
        channel: { id: channelId },
        user: { id: userId },
      },
    } = data;

    const payload: ChannelComment = {
      id,
      comment: new_comment,
      channel: channelId,
      user: userId,
    };

    this.store.dispatch(ChannelDetailCommentActions.putChannelComment({ id, payload }));
  }

  onDeleteComment(comment: { id: string; channel: Channel }): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    const {
      id,
      channel: { id: channel_id },
    } = comment;
    this.store.dispatch(ChannelDetailCommentActions.deleteChannelComment({ id, channel_id }));
  }

  onFavorite(channel: Channel): void {
    if (channel.enrolled) {
      this.deleteBookmark(channel);
      return;
    }
    this.saveBookmark(channel);
  }

  onPulseBookmark(pulse: PulseCardDto): void {
    if (pulse.bookmark_id) {
      this.deletePulseBookmark(pulse);
      return;
    }
    this.savePulseBookmark(pulse);
  }

  onNewPulse({ id: channelId }: Channel): void {
    this.store.dispatch(ChannelDetailActions.openPulseCreateDialog({ channelId }));
    const expandPanelSubscription = this._channelDetailService.expandPanel$.subscribe(() => {
      this.uploadDialogComponent?.expansionPanel?.open();
      expandPanelSubscription.unsubscribe();
    });
  }

  onClickRemove(file: KpUploadDialogItem): void {
    this._pulseUploadService.cancelFileUpload(file.id);
  }

  onSubscribe(channel: Channel): void {
    if (channel.enrolled) {
      this.store.dispatch(ChannelDetailActions.unsubscribeFromChannel({ channel }));
      return;
    }

    this.store.dispatch(
      ChannelDetailActions.subscribeToChannel({
        channel,
      }),
    );
  }

  onSeeMore() {
    this._channelDetailService.openDetailsDialog();
  }

  vinculateGroup(contentId: string): void {
    this.store.dispatch(VinculateToGroupActions.openDialog({ vinculateType: 'channel', contentId }));
  }

  onCommentChanged(value: string) {
    this.comment = value;
  }

  private saveBookmark(channel: Channel): void {
    const { id } = channel;
    const payload: ChannelSubscription = {
      channel: id,
      user: this.userId || '',
      active_subscription: true,
    };

    this.store.dispatch(ChannelDetailSubscriptionsActions.postChannelSubscriptions({ payload }));
  }

  private deleteBookmark(channel: Channel): void {
    const { id } = channel;
    const payload: ChannelSubscriptionsFilters = {
      channel: id,
      user: this.userId,
    };

    this.store.dispatch(ChannelDetailSubscriptionsActions.deleteChannelSubscriptions({ payload }));
  }

  private savePulseBookmark(pulse: PulseCardDto): void {
    this.store.dispatch(ChannelDetailPulsesActions.addPulseBookmark({ pulse }));
  }

  private deletePulseBookmark(pulse: PulseCardDto): void {
    this.store.dispatch(ChannelDetailPulsesActions.removePulseBookmark({ pulse }));
  }
}
