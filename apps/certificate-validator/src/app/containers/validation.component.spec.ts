import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ValidationComponent } from './validation.component';
import { getTranslocoTestingModule } from '../../utils/transloco-testing.module';
import { CertificateValidationService } from '../services/certificate-validation.service';

describe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;

  const mockService: Partial<CertificateValidationService> = {
    verificationCode: signal<string | undefined>(undefined),
    isLoading: signal(false),
    value: signal(undefined),
    hasError: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationComponent, getTranslocoTestingModule()],
      providers: [{ provide: CertificateValidationService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
