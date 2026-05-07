import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { ChatbotLoadingComponent } from './chatbot-loading.component';

describe('ChatbotLoadingComponent', () => {
  let component: ChatbotLoadingComponent;
  let fixture: ComponentFixture<ChatbotLoadingComponent>;
  let translocoService: jest.Mocked<TranslocoService>;

  const mockTranslations = {
    STEP1: 'Teste',
    STEP2: 'OK',
  };

  beforeEach(async () => {
    const translocoMock = {
      translateObject: jest.fn() as jest.Mock<any, [string]>,
    };

    await TestBed.configureTestingModule({
      imports: [ChatbotLoadingComponent],
      providers: [{ provide: TranslocoService, useValue: translocoMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotLoadingComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jest.Mocked<TranslocoService>;
  });

  describe('Loading Cycle', () => {
    it('should wait for translations and start typing first message', fakeAsync(() => {
      translocoService.translateObject.mockReturnValue(mockTranslations as any);
      component['startLoadingCycle']();
      fixture.detectChanges();

      tick(100);
      expect(component.currentText()).toBe('');

      tick(50);
      expect(component.currentText()).toBe('T');

      tick(50);
      expect(component.currentText()).toBe('Te');

      tick(50);
      expect(component.currentText()).toBe('Tes');

      tick(50);
      expect(component.currentText()).toBe('Test');

      tick(50);
      expect(component.currentText()).toBe('Teste');

      tick(2000);
      expect(component.currentText()).toBe('');

      tick(50);
      expect(component.currentText()).toBe('O');

      tick(50);
      expect(component.currentText()).toBe('OK');

      discardPeriodicTasks();
    }));
  });
});
