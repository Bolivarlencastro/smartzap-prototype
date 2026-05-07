import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChannelPulsesManagementHeaderComponent } from './channel-pulses-management-header.component';

const featureInitialState = {
  channelPulsesManagement: {
    channelId: 'ch-1',
    channelName: 'Test Channel',
    pulsesLoading: false,
    pulses: [],
    filter: { page: 1, per_page: 25 },
    totalItems: 0,
  },
};

describe('ChannelPulsesManagementHeaderComponent', () => {
  let fixture: ComponentFixture<ChannelPulsesManagementHeaderComponent>;
  let component: ChannelPulsesManagementHeaderComponent;
  let store: MockStore;
  let location: jest.Mocked<Location>;

  beforeEach(async () => {
    location = { back: jest.fn() } as unknown as jest.Mocked<Location>;

    TestBed.overrideComponent(ChannelPulsesManagementHeaderComponent, {
      remove: { imports: [KpGlobalSearchInputComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [ChannelPulsesManagementHeaderComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideMockStore({ initialState: featureInitialState }), { provide: Location, useValue: location }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChannelPulsesManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should call location.back() when onGoBack is called', () => {
    component.onGoBack();

    expect(location.back).toHaveBeenCalled();
  });
});
