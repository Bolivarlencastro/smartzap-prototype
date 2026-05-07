import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChannelPulsesManagementComponent } from './channel-pulses-management.component';
import { ChannelPulsesManagementHeaderComponent } from './containers/channel-pulses-management-header/channel-pulses-management-header.component';
import { ChannelPulsesManagementListComponent } from './containers/channel-pulses-management-list/channel-pulses-management-list.component';
import { ChannelPulsesManagementActions } from './store/actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { PulseUploadService } from 'app/main/channel/pages/detail/pulse-upload.service';
import { ChannelPulsesCreateService } from './services/channel-pulses-create.service';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';

const featureInitialState = {
  channelPulsesManagement: {
    channelId: null,
    channelName: null,
    pulsesLoading: false,
    pulses: [],
    filter: { page: 1, per_page: 25 },
    totalItems: 0,
  },
};

describe('ChannelPulsesManagementComponent', () => {
  let fixture: ComponentFixture<ChannelPulsesManagementComponent>;
  let component: ChannelPulsesManagementComponent;
  let store: MockStore;
  let pulseUploadService: jest.Mocked<PulseUploadService>;
  let createService: jest.Mocked<ChannelPulsesCreateService>;

  beforeEach(async () => {
    pulseUploadService = {
      displayedUploads: signal([]),
      clearUploads: jest.fn(),
      cancelFileUpload: jest.fn(),
    } as unknown as jest.Mocked<PulseUploadService>;

    createService = {
      expandPanel$: new Subject<void>(),
    } as unknown as jest.Mocked<ChannelPulsesCreateService>;

    TestBed.overrideComponent(ChannelPulsesManagementComponent, {
      remove: { imports: [ChannelPulsesManagementHeaderComponent, ChannelPulsesManagementListComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [ChannelPulsesManagementComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({ initialState: featureInitialState }),
        { provide: PulseUploadService, useValue: pulseUploadService },
        { provide: ChannelPulsesCreateService, useValue: createService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChannelPulsesManagementComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('ngOnInit', () => {
    it('should dispatch init with channelId', () => {
      const channelId = 'ch-123';
      fixture.componentRef.setInput('channelId', channelId);

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(ChannelPulsesManagementActions.init({ channelId }));
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch reset', () => {
      component.ngOnDestroy();

      expect(store.dispatch).toHaveBeenCalledWith(ChannelPulsesManagementActions.reset());
    });

    it('should call pulseUploadService.clearUploads', () => {
      component.ngOnDestroy();

      expect(pulseUploadService.clearUploads).toHaveBeenCalled();
    });
  });

  describe('pageChanged', () => {
    it('should dispatch setPagination with page = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 50, length: 100 };

      component['pageChanged'](event);

      expect(store.dispatch).toHaveBeenCalledWith(
        ChannelPulsesManagementActions.setPagination({ page: 3, perPage: 50 }),
      );
    });
  });

  describe('onNewPulse', () => {
    it('should dispatch createPulse action', () => {
      component['onNewPulse']();

      expect(store.dispatch).toHaveBeenCalledWith(ChannelPulsesManagementActions.createPulse());
    });

    it('should open the expansion panel when expandPanel$ emits', () => {
      const expansionPanel = { open: jest.fn() };
      component['uploadDialogComponent'] = { expansionPanel };

      component['onNewPulse']();
      (createService.expandPanel$ as Subject<void>).next();

      expect(expansionPanel.open).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should dispatch setFilter with the search term', () => {
      component.onSearch('my search');

      expect(store.dispatch).toHaveBeenCalledWith(
        ChannelPulsesManagementActions.setFilter({ filter: { search: 'my search' } }),
      );
    });
  });

  describe('onClickRemove', () => {
    it('should call pulseUploadService.cancelFileUpload with the file id', () => {
      const file = { id: 'upload-1', name: 'video.mp4' } as KpUploadDialogItem;

      component['onClickRemove'](file);

      expect(pulseUploadService.cancelFileUpload).toHaveBeenCalledWith('upload-1');
    });
  });
});
