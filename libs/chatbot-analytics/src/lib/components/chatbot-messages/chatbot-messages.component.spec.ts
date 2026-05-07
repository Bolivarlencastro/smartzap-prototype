import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../util';
import { ChatbotMessagesComponent } from './chatbot-messages.component';

describe('ChatbotInputComponent', () => {
  let component: ChatbotMessagesComponent;
  let fixture: ComponentFixture<ChatbotMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotMessagesComponent, getTranslocoTestingModule()],
      providers: [{ provide: UserProfileService, useValue: { getProfile: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit generateTable event', () => {
    const emitSpy = jest.spyOn(component.generateTable, 'emit');
    const token = '123';

    component.onGenerateTable(token);
    expect(emitSpy).toHaveBeenCalledWith(token);
  });

  it('should emit generatePlot event', () => {
    const emitSpy = jest.spyOn(component.generatePlot, 'emit');
    const token = '123';

    component.onGeneratePlot(token);
    expect(emitSpy).toHaveBeenCalledWith(token);
  });

  it('should emit downloadCSV event', () => {
    const emitSpy = jest.spyOn(component.downloadCSV, 'emit');
    const token = '123';

    component.onDownloadCSV(token);
    expect(emitSpy).toHaveBeenCalledWith(token);
  });

  it('should emit sendSuggestedMessage event', () => {
    const emitSpy = jest.spyOn(component.sendSuggestedMessage, 'emit');
    const question = 'Is this a question?';

    component.onSendSuggestedMessage(question);
    expect(emitSpy).toHaveBeenCalledWith(question);
  });
});
