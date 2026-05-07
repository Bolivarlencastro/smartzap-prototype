import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ChannelPulsesManagementListComponent } from './channel-pulses-management-list.component';
import { ChannelPulsesManagementActions } from '../../store/actions';
import { PulseManagementItem } from '../../models/channel-pulses-management.model';

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

const mockPulse: PulseManagementItem = {
  id: 'p-1',
  name: 'Test Pulse',
  pulse_type: { id: 'pt-1', name: 'Video' },
  creator_name: 'Admin',
  published_date: '2024-01-01',
  is_active: true,
};

describe('ChannelPulsesManagementListComponent', () => {
  let fixture: ComponentFixture<ChannelPulsesManagementListComponent>;
  let component: ChannelPulsesManagementListComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelPulsesManagementListComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideMockStore({ initialState: featureInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChannelPulsesManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should dispatch editPulse when onEditPulse is called', () => {
    component.onEditPulse(mockPulse);

    expect(store.dispatch).toHaveBeenCalledWith(ChannelPulsesManagementActions.editPulse({ pulseId: mockPulse.id }));
  });

  it('should dispatch editContent when onEditContent is called', () => {
    component.onEditContent(mockPulse);

    expect(store.dispatch).toHaveBeenCalledWith(
      ChannelPulsesManagementActions.editContent({ pulseId: mockPulse.id, pulseTypeName: mockPulse.pulse_type.name }),
    );
  });

  it('should dispatch toggleActivation when onToggleActivation is called', () => {
    component.onToggleActivation(mockPulse);

    expect(store.dispatch).toHaveBeenCalledWith(
      ChannelPulsesManagementActions.toggleActivation({ pulseId: mockPulse.id, isActive: mockPulse.is_active }),
    );
  });

  it('should dispatch deletePulse when onDeletePulse is called', () => {
    component.onDeletePulse(mockPulse);

    expect(store.dispatch).toHaveBeenCalledWith(ChannelPulsesManagementActions.deletePulse({ pulseId: mockPulse.id }));
  });
});
