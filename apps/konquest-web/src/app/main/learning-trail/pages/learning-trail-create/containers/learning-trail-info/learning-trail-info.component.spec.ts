import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningTrailInfoComponent } from './learning-trail-info.component';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import {
  CustomCertificateDto,
  LanguagesService,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearningTrailInfoFormComponent } from '../../components/forms/learning-trail-info-form/learning-trail-info-form.component';
import { signal } from '@angular/core';
import { LearningTrailCreateActions, LearningTrailInfoActions } from '../../store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { ptBR } from 'date-fns/locale';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  CertificateLearnContentFacade,
  NewCertificateDialogFacade,
} from '@keeps-platform-frontend-workspace/custom-certificates';
import { Chance } from 'chance';

describe('LearningTrailInfoComponent', () => {
  let component: LearningTrailInfoComponent;
  let fixture: ComponentFixture<LearningTrailInfoComponent>;
  let store: jest.Mocked<Store>;
  let languagesService: jest.Mocked<LanguagesService>;
  let newCertificateDialogFacadeMock: jest.Mocked<NewCertificateDialogFacade>;
  let certificateLearnContentFacadeMock: jest.Mocked<CertificateLearnContentFacade>;
  const chance = new Chance();

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<Store>;

    languagesService = {
      languagesTypes: signal([]),
    } as unknown as jest.Mocked<LanguagesService>;

    newCertificateDialogFacadeMock = {
      newCertificate: jest.fn(),
    } as unknown as jest.Mocked<NewCertificateDialogFacade>;

    certificateLearnContentFacadeMock = {
      certificates$: of([]),
      learnContentCertificate$: of(EMPTY),
      previewCertificate: jest.fn(),
      saveLearnContentCertificate: jest.fn(),
      loadCertificatesForLearnContent: jest.fn(),
    } as unknown as jest.Mocked<CertificateLearnContentFacade>;

    await TestBed.configureTestingModule({
      imports: [LearningTrailInfoFormComponent, getTranslocoTestingModule(), MatDateFnsModule, NoopAnimationsModule],
      providers: [
        { provide: Store, useValue: store },
        { provide: LanguagesService, useValue: languagesService },
        {
          provide: MAT_DATE_LOCALE,
          useValue: ptBR,
        },
        { provide: NewCertificateDialogFacade, useValue: newCertificateDialogFacadeMock },
        { provide: CertificateLearnContentFacade, useValue: certificateLearnContentFacadeMock },
        { provide: UserProfileService, useValue: { hasRoles: jest.fn() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningTrailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch LearningTrailInfoActions.init on component initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(LearningTrailInfoActions.init());
  });

  it('should dispatch saveLearningTrail action when saveLearningTrail is called', () => {
    const mockLearningTrail = { id: 'trail1' } as any;
    component.saveLearningTrail(mockLearningTrail);
    expect(store.dispatch).toHaveBeenCalledWith(
      LearningTrailCreateActions.saveLearningTrail({ learningTrail: mockLearningTrail }),
    );
  });

  it('should load the custom certificates for trails', () => {
    expect(certificateLearnContentFacadeMock.loadCertificatesForLearnContent).toHaveBeenCalledWith('trail');
  });

  it('should open the new certificate dialog', () => {
    component.createCertificate();

    expect(newCertificateDialogFacadeMock.newCertificate).toHaveBeenCalled();
  });

  it('should open the new certificate preview dialog', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    component.previewCertificate(certificate);

    expect(certificateLearnContentFacadeMock.previewCertificate).toHaveBeenCalledWith(certificate);
  });
});
