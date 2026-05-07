import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardPulseSectionComponent } from './dashboard-pulse-section.component';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';

describe('DashboardPulseSectionComponent', () => {
  let component: DashboardPulseSectionComponent;
  let fixture: ComponentFixture<DashboardPulseSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPulseSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPulseSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit card click', () => {
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    const mockPulse = { id: 'mock_id' } as PulseCardDto;

    component.onCardClick(mockPulse);

    expect(emitSpy).toHaveBeenCalledWith(mockPulse);
  });

  it('should emit bookmark change event', () => {
    const emitSpy = jest.spyOn(component.bookmarkChange, 'emit');
    const mockPulse = { id: 'mock_id' } as PulseCardDto;

    component.onBookmark(mockPulse);

    expect(emitSpy).toHaveBeenCalledWith(mockPulse);
  });
});
