import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguagesService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ChannelFormActions } from 'app/main/channel/pages/form/store/actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Channel } from '../../channel.model';
import * as ChannelTypesSelectors from '../../store/channel-types/channel-types.selectors';
import * as ChannelSelectors from '../../store/channel/channel.selectors';
import { ChannelFormComponent } from './channel-form.component';
import { ChannelFormSelectors } from './store/selectors';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const channel = {
  name: 'Channel name',
  rating_avg: 4,
  enrolled: false,
  holder_image: 'url_cover.png',
  description: 'Description',
  is_active: true,
  language: 'pt-BR',
  channel_type: { id: 1, name: 'Channel type' },
  channel_category: { name: 'Channel category' },
  channel_statistics: { total_subscribers: 5, total_pulses: 6 },
  card: {
    holder_image: 'url_cover.png',
  },
} as unknown as Channel;

describe('ChannelFormComponent', () => {
  let component: ChannelFormComponent;
  let fixture: ComponentFixture<ChannelFormComponent>;
  let dispatchSpy: jest.SpyInstance;
  let fuseLoadingServiceMock: jest.Mocked<FuseLoadingService>;
  let mockLanguagesService: jest.Mocked<LanguagesService>;

  beforeEach(async () => {
    fuseLoadingServiceMock = { show: jest.fn() } as unknown as jest.Mocked<FuseLoadingService>;
    mockLanguagesService = { languagesTypes: signal([]) } as unknown as jest.Mocked<LanguagesService>;

    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), ChannelFormComponent, MatIconTestingModule],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        {
          provide: KpMessageService,
          useValue: {},
        },
        {
          provide: WorkspaceService,
          useValue: { getCurrentWorkspace: jest.fn() },
        },
        { provide: FuseLoadingService, useValue: fuseLoadingServiceMock },
        { provide: LanguagesService, useValue: mockLanguagesService },
        provideMockStore({
          selectors: [
            {
              selector: ChannelFormSelectors.selectChannelForm,
              value: channel,
            },
            {
              selector: ChannelTypesSelectors.selectChannelTypes,
              value: [],
            },
            {
              selector: ChannelSelectors.selectChannelLoading,
              value: false,
            },
          ],
          initialState: {},
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFormComponent);
    component = fixture.componentInstance;
    const store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should dispatch the save action on submit when the form is not pristine', () => {
      component.informationFormGroup.markAsDirty();

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(ChannelFormActions.submit({ id: null, channel: expect.anything() }));
    });

    it('should go to next step the on submit when the form is pristine', () => {
      const nextSpy = jest.spyOn(component.stepperRef, 'next');

      component.onSubmit();

      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
