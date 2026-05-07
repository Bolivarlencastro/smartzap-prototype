import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { KpPulseCardComponent } from './kp-pulse-card.component';

describe('KpPulseCardComponent', () => {
  let component: KpPulseCardComponent;
  let fixture: ComponentFixture<KpPulseCardComponent>;

  const pulse__mock = {
    id: '2647fb7c-bd0e-4c18-bb0f-b877c665e5aa',
    name: 'https://vimeo.com/100716497',
    is_active: false,
    channel_name: 'Canal inativo',
    pulse_type: {
      id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
      name: 'Video',
    },
    cover_image: null,
    bookmark_id: null,
    stats: {
      duration: 10,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KpPulseCardComponent,
        MatIconTestingModule,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              GENERAL: {
                INACTIVE: 'Inactive',
              },
            },
          },
          translocoConfig: {
            availableLangs: ['en'],
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpPulseCardComponent);
    component = fixture.componentInstance;
  });

  test('should display kp-pulse-card-inactive with translated text "Inactive" when pulse.is_active is false', async () => {
    component.pulse = pulse__mock;
    fixture.detectChanges();
    await fixture.whenStable();

    const inactiveElement = fixture.debugElement.query(By.css('.kp-pulse-card-inactive'));
    expect(inactiveElement).toBeTruthy();

    const inactiveText = inactiveElement.nativeElement.textContent.trim();
    expect(inactiveText).toBe('Inactive');
  });

  test('should not display kp-pulse-card-inactive when pulse.is_active is true', async () => {
    component.pulse = { ...pulse__mock, is_active: true };
    fixture.detectChanges();
    await fixture.whenStable();

    const inactiveElement = fixture.debugElement.query(By.css('.kp-pulse-card-inactive'));
    expect(inactiveElement).toBeFalsy();
  });

  test('should disable pulse-toggle-favorite button when pulse.is_active is false', () => {
    component.pulse = pulse__mock;
    component.showFavoriteButton = true;
    fixture.detectChanges();

    const favoriteButton = fixture.debugElement.query(By.css('[data-test="pulse-toggle-favorite"]'));
    expect(favoriteButton).toBeTruthy();
    expect(favoriteButton.nativeElement.disabled).toBe(true);
  });

  test('should enable pulse-toggle-favorite button when pulse.is_active is true', () => {
    component.pulse = { ...pulse__mock, is_active: true };
    component.showFavoriteButton = true;
    fixture.detectChanges();

    const favoriteButton = fixture.debugElement.query(By.css('[data-test="pulse-toggle-favorite"]'));
    expect(favoriteButton).toBeTruthy();
    expect(favoriteButton.nativeElement.disabled).toBe(false);
  });
});
