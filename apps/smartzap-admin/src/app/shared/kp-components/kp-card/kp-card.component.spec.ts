import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { KpCardComponent } from './kp-card.component';
import { KpCardModel } from './kp-card.model';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('KpCardComponent', () => {
  let component: KpCardComponent;
  let fixture: ComponentFixture<KpCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [KpCardComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    });

    fixture = TestBed.createComponent(KpCardComponent);
    component = fixture.componentInstance;
    component.data = { image: 'test' } as KpCardModel;
    fixture.detectChanges();
  });

  it('should flip card', () => {
    component.flipped = true;
    fixture.detectChanges();

    component.unflip();
    expect(component.flipped).toBe(false);
  });
});
