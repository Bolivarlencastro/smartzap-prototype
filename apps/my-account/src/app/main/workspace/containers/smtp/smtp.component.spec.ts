import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { EMPTY, of } from 'rxjs';
import { SMTPComponent } from './smtp.component';
import { SMTPData, SMTPService } from './smtp.service';

const mockSMTPData: SMTPData = {
  enable_email_notifications: true,
  use_own_smtp: true,
  host: 'smtp.example.com',
  port: 587,
  user: 'testuser',
  sender_email: 'test@example.com',
  secure: true,
  reject_unauthorized: false,
};

describe('SMTPComponent', () => {
  let component: SMTPComponent;
  let fixture: ComponentFixture<SMTPComponent>;
  let smtpService: jest.Mocked<SMTPService>;

  beforeEach(async () => {
    const mockSMTPService = {
      fetchSMTPData: jest.fn(() => of(mockSMTPData)),
      save: jest.fn(() => of(EMPTY)),
      testConnection: jest.fn(() => of(EMPTY)),
      updateEmailSendingStatus: jest.fn(),
      updateUseOwnSMTPStatus: jest.fn(),
    } as unknown as jest.Mocked<SMTPService>;

    await TestBed.configureTestingModule({
      imports: [SMTPComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: SMTPService,
          useValue: mockSMTPService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    smtpService = TestBed.inject(SMTPService) as jest.Mocked<SMTPService>;
    fixture = TestBed.createComponent(SMTPComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('initForm', () => {
    it('should initialize the form with correct controls', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('host')).toBeDefined();
      expect(component.form.get('port')).toBeDefined();
      expect(component.form.get('user')).toBeDefined();
      expect(component.form.get('password')).toBeDefined();
      expect(component.form.get('senderEmail')).toBeDefined();
      expect(component.form.get('secure')).toBeDefined();
      expect(component.form.get('rejectUnauthorized')).toBeDefined();
    });

    it('should patch form with data from SMTPService on init', () => {
      expect(smtpService.fetchSMTPData).toHaveBeenCalled();
      expect(component.enableEmailNotifications()).toBe(true);
      expect(component.useOwnSMTP()).toBe(true);
      expect(component.form.get('host')?.value).toBe('smtp.example.com');
      expect(component.form.get('port')?.value).toBe(587);
      expect(component.form.get('user')?.value).toBe('testuser');
      expect(component.form.get('senderEmail')?.value).toBe('test@example.com');
      expect(component.form.get('secure')?.value).toBe(true);
      expect(component.form.get('rejectUnauthorized')?.value).toBe(false);
    });
  });

  it('should toggle password visibility when onTogglePasswordVisibility is called', () => {
    component.hidePassword = true;

    component.onTogglePasswordVisibility();

    expect(component.hidePassword).toBe(false);
  });

  describe('testAndSubmit', () => {
    it('should test connection', () => {
      component.form.patchValue({ password: '123' });

      component.onTestConnection();

      expect(smtpService.testConnection).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        user: 'testuser',
        password: '123',
        senderEmail: 'test@example.com',
        secure: true,
        rejectUnauthorized: false,
      });
    });

    it('should submit form', () => {
      component.form.patchValue({ password: '456' });
      component.onTestConnection();
      fixture.detectChanges();

      component.onSubmit();

      expect(component.isConnectionTested()).toBe(true);
      expect(smtpService.save).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        user: 'testuser',
        password: '456',
        senderEmail: 'test@example.com',
        secure: true,
        rejectUnauthorized: false,
      });
    });
  });

  describe('toggleEmailNotifications', () => {
    const cases: any[] = [
      ['enable', true, true, true],
      ['disable', true, false, false],
      ['disable', false, true, false],
      ['disable', false, false, false],
    ];

    test.each(cases)(
      'should %p form when enable_email_notifications is %p',
      (_, enable_email_notifications, use_own_smtp, result) => {
        component.enableEmailNotifications.set(enable_email_notifications);
        component.useOwnSMTP.set(use_own_smtp);
        fixture.detectChanges();

        expect(component.form.get('host').enabled).toBe(result);
        expect(component.form.get('port').enabled).toBe(result);
        expect(component.form.get('user').enabled).toBe(result);
        expect(component.form.get('password').enabled).toBe(result);
        expect(component.form.get('senderEmail').enabled).toBe(result);
        expect(component.form.get('secure').enabled).toBe(result);
        expect(component.form.get('rejectUnauthorized').enabled).toBe(result);
      },
    );
  });
});
