import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningTrailInfoFormComponent } from '../../components/forms/learning-trail-info-form/learning-trail-info-form.component';
import { Observable } from 'rxjs';
import { LearningTrail, LearningTrailType } from '@app/main/learning-trail/model/learning-trail';
import {
  CustomCertificateDto,
  LanguagesService,
  LanguageTypes,
  LearnContentCertificateChange,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { LearningTrailCreateActions, LearningTrailInfoActions } from '../../store';
import { learningTrailInfoFeature } from '../../store/features/learning-trail-info.feature';
import { learningTrailCreateFeature } from '../../store/features/learning-trail-create.feature';
import {
  CertificateLearnContentFacade,
  NewCertificateDialogFacade,
} from '@keeps-platform-frontend-workspace/custom-certificates';

@Component({
  selector: 'app-learning-trail-info',
  imports: [CommonModule, LearningTrailInfoFormComponent],
  template: `
    <app-learning-trail-info-form
      [languages]="languages()"
      [types]="learningTrailTypes$ | async"
      [certificates]="certificates$ | async"
      [learningTrail]="learningTrail$ | async"
      [learnContentCertificate]="learnContentCertificate$ | async"
      [isContentCreator]="isContentCreator"
      (save)="saveLearningTrail($event)"
      (previewCertificate)="previewCertificate($event)"
      (newCertificate)="createCertificate()"
      (certificateChange)="certificateChange($event)"
    >
      >
    </app-learning-trail-info-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailInfoComponent {
  protected readonly learningTrail$: Observable<LearningTrail>;
  protected readonly learningTrailTypes$!: Observable<LearningTrailType[]>;
  protected readonly certificates$: Observable<CustomCertificateDto[]>;
  protected readonly learnContentCertificate$: Observable<CustomCertificateDto>;
  protected readonly languages: Signal<LanguageTypes[]>;
  protected readonly isContentCreator: boolean;
  learningTrailId!: string;

  constructor(
    private readonly store: Store,
    private readonly languagesService: LanguagesService,
    private readonly newCertificateDialogFacade: NewCertificateDialogFacade,
    private readonly certificateLearnContentFacade: CertificateLearnContentFacade,
    private readonly userProfileService: UserProfileService,
  ) {
    this.store.dispatch(LearningTrailInfoActions.init());
    this.languages = this.languagesService.languagesTypes;
    this.learningTrailTypes$ = this.store.select(learningTrailInfoFeature.selectTypes);
    this.learningTrail$ = this.store.select(learningTrailCreateFeature.selectLearningTrail);
    this.learnContentCertificate$ = this.certificateLearnContentFacade.learnContentCertificate$;
    this.certificates$ = this.certificateLearnContentFacade.certificates$;
    this.isContentCreator = this.userProfileService.hasRoles(['content']);

    if (!this.isContentCreator) {
      this.certificateLearnContentFacade.loadCertificatesForLearnContent('trail');
    }
  }

  saveLearningTrail(learningTrail: LearningTrail | undefined): void {
    this.store.dispatch(LearningTrailCreateActions.saveLearningTrail({ learningTrail }));
  }

  previewCertificate(certificate: CustomCertificateDto): void {
    this.certificateLearnContentFacade.previewCertificate(certificate);
  }

  createCertificate(): void {
    this.newCertificateDialogFacade.newCertificate();
  }

  certificateChange(event: LearnContentCertificateChange) {
    this.certificateLearnContentFacade.saveLearnContentCertificate(event);
  }
}
