import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../util';
import { ChatbotInputComponent } from './chatbot-input.component';

describe('ChatbotInputComponent', () => {
  let component: ChatbotInputComponent;
  let fixture: ComponentFixture<ChatbotInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotInputComponent, getTranslocoTestingModule()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('disabledButton', () => {
    it('should disable the send button when input is empty', () => {
      component.input = '';
      fixture.detectChanges();

      expect(component.disabledButton).toBe(true);
    });

    it('should disable the send button when is loading', () => {
      component.input = 'Hello';
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      expect(component.disabledButton).toBe(true);
    });

    it('should enable the send button', () => {
      component.input = 'Hello';
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();

      expect(component.disabledButton).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should emit send event when sendMessage is called', () => {
      const emitSpy = jest.spyOn(component.send, 'emit');
      component.input = 'Test message';

      component.sendMessage();

      expect(emitSpy).toHaveBeenCalledWith('Test message');
      expect(component.input).toBe('');
    });

    describe('sendMessage with enter key', () => {
      it('should call sendMessage when Enter key is pressed and button is not disabled', () => {
        const sendMessageSpy = jest.spyOn(component, 'sendMessage');
        component.input = 'Test message';
        fixture.componentRef.setInput('isLoading', false);
        fixture.detectChanges();

        const event = new KeyboardEvent('keyup', { key: 'Enter' });
        document.dispatchEvent(event);

        expect(sendMessageSpy).toHaveBeenCalled();
      });

      it('should not call sendMessage when Enter key is pressed and button is disabled', () => {
        const sendMessageSpy = jest.spyOn(component, 'sendMessage');
        component.input = 'Test message';
        fixture.componentRef.setInput('isLoading', true);
        fixture.detectChanges();

        const event = new KeyboardEvent('keyup', { key: 'Enter' });
        document.dispatchEvent(event);

        expect(sendMessageSpy).not.toHaveBeenCalled();
      });
    });
  });
});
