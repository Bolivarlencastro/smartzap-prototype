import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KEEPS_DATE_FORMATS, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { UserFormComponent } from './user-form.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { provideNgxMask } from 'ngx-mask';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent, getTranslocoTestingModule()],
      providers: [
        provideNgxMask(),
        { provide: UserProfileService, useValue: { hasRoles: jest.fn() } },
        {
          provide: DateAdapter,
          useClass: DateFnsAdapter,
        },
        { provide: MAT_DATE_LOCALE, useValue: enUS },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit userAction event with sendInvitation value', () => {
    const emitSpy = jest.spyOn(component.userAction, 'emit');
    component.onSendEmail();
    expect(emitSpy).toHaveBeenCalledWith('sendInvitation');
  });

  it('should emit userAction event with resetPassword value', () => {
    const emitSpy = jest.spyOn(component.userAction, 'emit');
    component.onResetPassword();
    expect(emitSpy).toHaveBeenCalledWith('resetPassword');
  });

  it('should emit userAction event with importData value', () => {
    const emitSpy = jest.spyOn(component.userAction, 'emit');
    component.onImportData();
    expect(emitSpy).toHaveBeenCalledWith('importData');
  });
});
