import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFormComponent } from './account-form.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFormComponent, getTranslocoTestingModule()],
      providers: [provideDateFnsAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
  });

  describe('normalizeProfile', () => {
    it('should return normalized profile', () => {
      const mockFormData = {
        phone: '123456789',
        nickname: 'test_nickname',
        birthday: null,
        secondary_email: 'secondary@test.com',
        language_id: 'en',
        address: '123 Street',
      } as Partial<UserProfile>;

      const result = component.normalizeProfile(mockFormData);

      expect(result).toEqual({
        phone: '123456789',
        nickname: 'test_nickname',
        secondary_email: 'secondary@test.com',
        address: '123 Street',
        language_id: 'en',
        birthday: null,
      });
    });
  });

  describe('populateForm', () => {
    it('should populate the form with provided user profile data', () => {
      const mockUserProfile = {
        id: '1',
        name: 'John Doe',
        nickname: 'John',
        email: 'john.doe@example.com',
        secondary_email: 'john.secondary@example.com',
        phone: '123456789',
        birthday: '1980-01-01',
        address: '123 Main Street',
        country: 'US',
        language: { id: 'en', name: 'en' },
        language_id: 'en',
      } as unknown as UserProfile;

      component.populateForm(mockUserProfile);

      expect(component.accountForm.getRawValue()).toEqual({
        name: mockUserProfile.name,
        nickname: mockUserProfile.nickname,
        phone: mockUserProfile.phone,
        birthday: mockUserProfile.birthday,
        email: mockUserProfile.email,
        secondary_email: mockUserProfile.secondary_email,
        country: mockUserProfile.country,
        language_id: 'en',
        address: mockUserProfile.address,
      });
    });

    it('should do nothing when called with null', () => {
      const initialFormValue = component.accountForm.value;

      component.populateForm(null);

      expect(component.accountForm.value).toEqual(initialFormValue);
    });

    it('should do nothing when called with undefined', () => {
      const initialFormValue = component.accountForm.value;

      component.populateForm(undefined);

      expect(component.accountForm.value).toEqual(initialFormValue);
    });
  });

  describe('ngOnChanges', () => {
    it('should call populateForm with the new profile when profile changes', () => {
      const mockProfile = {
        id: '1',
        name: 'Jane Doe',
        nickname: 'Jane',
        email: 'jane.doe@example.com',
      } as UserProfile;

      const changes: SimpleChanges = {
        profile: {
          currentValue: mockProfile,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      jest.spyOn(component, 'populateForm');

      component.profile = mockProfile;
      component.ngOnChanges(changes);

      expect(component.populateForm).toHaveBeenCalledWith(mockProfile);
    });
  });

  describe('initForm', () => {
    it('should create a form group with the expected controls and default values', () => {
      const formGroup = component.initForm();

      expect(formGroup.controls).toEqual(
        expect.objectContaining({
          name: expect.any(FormControl),
          nickname: expect.any(FormControl),
          phone: expect.any(FormControl),
          birthday: expect.any(FormControl),
          email: expect.any(FormControl),
          secondary_email: expect.any(FormControl),
          country: expect.any(FormControl),
          language_id: expect.any(FormControl),
          address: expect.any(FormControl),
        }),
      );

      expect(formGroup.get('name')?.value).toBeNull();
      expect(formGroup.get('name')?.disabled).toBe(true);
      expect(formGroup.get('name')?.hasValidator(Validators.required)).toBe(true);

      expect(formGroup.get('secondary_email')?.hasValidator(Validators.email)).toBe(true);
      expect(formGroup.get('email')?.disabled).toBe(true);
      expect(formGroup.get('language_id')?.hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('onSubmitForm', () => {
    it('should emit normalized profile and mark form as pristine when the form is valid', () => {
      const validFormData = {
        name: 'John Doe',
        nickname: 'John',
        phone: '123456789',
        email: 'john.doe@example.com',
        secondary_email: 'john.secondary@example.com',
        country: 'US',
        language_id: 'en',
        address: '123 Main Street',
      };

      jest.spyOn(component.submitForm, 'emit');
      component.accountForm.patchValue(validFormData);

      component.onSubmitForm();

      expect(component.submitForm.emit).toHaveBeenCalledWith({
        phone: validFormData.phone,
        nickname: validFormData.nickname,
        secondary_email: validFormData.secondary_email,
        address: validFormData.address,
        language_id: validFormData.language_id,
        birthday: null,
      });
      expect(component.accountForm.pristine).toBeTruthy();
    });
  });
});
