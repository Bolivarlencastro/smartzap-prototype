import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpSnackLoadingComponent } from './kp-snack-loading.component';

describe('KpSnackLoading', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const expectedMessage = 'UI.GENERAL.LOADING';
  const expectedCustomMessage = 'UI.GENERAL.LOADING_CERTIFICATE';

  describe('should create without data', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [getTranslocoTestingModule(), KpSnackLoadingComponent],
        declarations: [TestHostComponent],
        providers: [
          {
            provide: MAT_SNACK_BAR_DATA,
            useValue: {},
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      // given
      expect(component).toBeTruthy();
      const message = fixture.debugElement.query(By.css('[data-test="kp-snack-loading.snack-message"]'))
        .nativeElement as HTMLElement;

      // expected
      expect(message.innerHTML).toContain(expectedMessage);
    });
  });

  describe('should create with data', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [getTranslocoTestingModule(), KpSnackLoadingComponent],
        declarations: [TestHostComponent],
        providers: [
          {
            provide: MAT_SNACK_BAR_DATA,
            useValue: { message: expectedCustomMessage },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      // given
      expect(component).toBeTruthy();
      const message = fixture.debugElement.query(By.css('[data-test="kp-snack-loading.snack-message"]'))
        .nativeElement as HTMLElement;

      // expected
      expect(message.innerHTML).toContain(expectedCustomMessage);
    });
  });
});

@Component({
  template: ` <kp-snack-loading></kp-snack-loading>`,
  standalone: false,
})
class TestHostComponent {}
