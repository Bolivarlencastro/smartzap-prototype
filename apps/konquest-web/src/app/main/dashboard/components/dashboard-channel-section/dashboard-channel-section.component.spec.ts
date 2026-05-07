import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardChannelSectionComponent } from './dashboard-channel-section.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';

describe('DashboardChannelSectionComponent', () => {
  let component: DashboardChannelSectionComponent;
  let fixture: ComponentFixture<DashboardChannelSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChannelSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChannelSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit card click', () => {
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    const mockChannel = { id: 'mock_id' } as KpChannelCardModel;

    component.onCardClick(mockChannel);

    expect(emitSpy).toHaveBeenCalledWith(mockChannel);
  });

  it('should emit subscribe event', () => {
    const emitSpy = jest.spyOn(component.subscribeChange, 'emit');
    const mockChannel = { id: 'mock_id' } as KpChannelCardModel;

    component.onSubscribe(mockChannel);

    expect(emitSpy).toHaveBeenCalledWith(mockChannel);
  });
});
