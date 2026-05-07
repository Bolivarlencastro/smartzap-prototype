import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReportCardComponent } from './report-card.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('ReportCardComponent', () => {
  let component: ReportCardComponent;
  let fixture: ComponentFixture<ReportCardComponent>;
  let cardDe: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCardComponent, getTranslocoTestingModule(), MatIconTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardComponent);
    component = fixture.componentInstance;
    cardDe = fixture.debugElement;
    component.showDatails = true;
    fixture.detectChanges();
  });

  it('should render card icon', () => {
    component.svgIcon = 'pulse';
    fixture.detectChanges();
    const cardIcon = cardDe.query(By.css('[data-test="card-icon"]'));
    expect(cardIcon.attributes['data-mat-icon-name']).toContain('pulse');
  });

  it('should render card text', () => {
    component.label = 'Mock Text';
    fixture.detectChanges();
    const cardText = cardDe.query(By.css('h4'));
    expect(cardText.nativeElement.textContent).toContain('Mock Text');
  });

  it('should render card with primary color', () => {
    component.colored = true;
    fixture.detectChanges();
    const matCard = cardDe.query(By.css('mat-card'));
    expect(matCard.classes['primary-color']).toBe(true);
  });

  it('should fire click event', () => {
    jest.spyOn(component.cardSelected, 'emit').mockImplementation(() => {});
    const matCard = cardDe.query(By.css('mat-card'));
    matCard.nativeElement.click();
    expect(component.cardSelected.emit).toHaveBeenCalled();
    expect(component.cardSelected.emit).toHaveBeenCalledTimes(1);
  });

  it('should render card detail button with icon', () => {
    const cardDetailIcon = cardDe.query(By.css('[data-test="detail-icon"]'));
    expect(cardDetailIcon.attributes['data-mat-icon-name']).toContain('ondemand_video');
  });
});
