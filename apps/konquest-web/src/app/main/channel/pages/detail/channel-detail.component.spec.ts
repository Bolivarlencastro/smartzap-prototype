import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { initialState, transferDialogFeatureKey } from '@app/main/transfer-dialog/store';
import { PulseService, UserService } from '@core/api';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChannelDetailComponent } from './channel-detail.component';
import { ChannelDetailService } from './channel-detail.service';
import { initialState as commentsInitialState } from './store/reducers/channel-detail-comment.reducer';
import { initialState as pulsesInitialState } from './store/reducers/channel-detail-pulses.reducer';
import { initialState as ratingsInitialState } from './store/reducers/channel-detail-ratings.reducer';
import { initialState as detailsInitialState } from './store/reducers/channel-detail.reducer';
import { channelCommentFeatureKey } from './store/selectors/channel-detail-comment.selectors';
import { getPulsesFeatureKey } from './store/selectors/channel-detail-pulses.selectors';
import { channelRatingFeatureKey } from './store/selectors/channel-detail-ratings.selectors';
import { channelDetailFeatureKey } from './store/selectors/channel-detail.selectors';
import { ChannelDetailActions } from './store/actions';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { VinculateToGroupActions } from '@app/shared/store';
import { provideRouter } from '@angular/router';
import { PulseUploadService } from './pulse-upload.service';
import { KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';

describe('ChannelDetailComponent', () => {
  let component: ChannelDetailComponent;
  let fixture: ComponentFixture<ChannelDetailComponent>;
  let pulseUploadServiceMock: jest.Mocked<PulseUploadService>;
  let store: MockStore;

  beforeEach(() => {
    pulseUploadServiceMock = {
      displayedUploads: signal([]),
      clearUploads: jest.fn(),
      cancelFileUpload: jest.fn(),
    } as unknown as jest.Mocked<PulseUploadService>;

    TestBed.configureTestingModule({
      imports: [ChannelDetailComponent, getTranslocoTestingModule()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        provideMockStore({ initialState: { [transferDialogFeatureKey]: initialState } }),
        provideMockStore({ initialState: { [getPulsesFeatureKey]: pulsesInitialState } }),
        provideMockStore({ initialState: { [channelCommentFeatureKey]: commentsInitialState } }),
        provideMockStore({ initialState: { [channelDetailFeatureKey]: detailsInitialState } }),
        provideMockStore({ initialState: { [channelRatingFeatureKey]: ratingsInitialState } }),
        { provide: AuthService, useValue: {} },
        { provide: UserProfileService, useValue: { isCurator: jest.fn(), isSuperAdmin: jest.fn() } },
        { provide: PulseService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: ChannelDetailService, useValue: {} },
        { provide: PulseUploadService, useValue: pulseUploadServiceMock },
      ],
    });
    fixture = TestBed.createComponent(ChannelDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should subscribe or unsubscribe to the channel', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const channel1 = { id: '1', enrolled: true };
    const channel2 = { id: '2', enrolled: false };
    component.userId = '324';
    fixture.detectChanges();

    component.onSubscribe(channel1);
    expect(spy).toHaveBeenCalledWith(ChannelDetailActions.unsubscribeFromChannel({ channel: channel1 }));

    component.onSubscribe(channel2);
    expect(spy).toHaveBeenCalledWith(ChannelDetailActions.subscribeToChannel({ channel: channel2 }));
  });

  it('should dispatch openDialog action when vinculate group', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const contentId = 'content1';

    component.vinculateGroup(contentId);

    expect(spy).toHaveBeenCalledWith(VinculateToGroupActions.openDialog({ vinculateType: 'channel', contentId }));
  });

  it('should cancel a file upload', () => {
    component.onClickRemove({ id: 'mock_id' } as KpUploadDialogItem);
    expect(pulseUploadServiceMock.cancelFileUpload).toHaveBeenCalledWith('mock_id');
  });

  it('should clear all uploads on destroy', () => {
    component.ngOnDestroy();
    expect(pulseUploadServiceMock.clearUploads).toHaveBeenCalled();
  });
});
