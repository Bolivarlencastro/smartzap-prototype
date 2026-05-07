import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningTrailFormHeaderComponent } from '../../components/learning-trail-form-header/learning-trail-form-header.component';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable, tap } from 'rxjs';
import {
  ContentStep,
  CreateLearnContentEvent,
  LearningTrail,
  Step,
  TrailLearnContent,
} from '@app/main/learning-trail/model/learning-trail';
import { Store } from '@ngrx/store';
import { LearningTrailCreateActions } from '../../store';
import { learningTrailCreateFeature } from '../../store/features/learning-trail-create.feature';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { LearningTrailStepContentComponent } from '../../components/learning-trail-step-content/learning-trail-step-content.component';

@Component({
  selector: 'app-learning-trail-content',
  imports: [CommonModule, LearningTrailFormHeaderComponent, TranslocoModule, LearningTrailStepContentComponent],
  template: `
    <app-learning-trail-form-header
      class="w-full mb-4"
      [title]="'MISSION.CREATE.NAVIGATION.TITLE.INFO' | transloco"
      [label]="'MISSION.CREATE.NAVIGATION.SUBTITLE.FILL_ALL_FIELDS' | transloco"
      [hidePrevious]="false"
      (next)="next()"
      (previous)="previous()"
    ></app-learning-trail-form-header>

    <learning-trail-step-content
      [learningTrail]="learningTrail$ | async"
      [contentOptions]="contents$ | async"
      [isLoadingContents]="isLoadingContents$ | async"
      (loadContents)="onLoadContents($event)"
      (createContent)="onCreateContent($event)"
      (dropContentEvent)="onDropContent($event)"
      (removeContent)="onRemoveContent($event)"
    ></learning-trail-step-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailContentComponent {
  protected readonly learningTrail$: Observable<LearningTrail>;
  protected readonly contents$!: Observable<TrailLearnContent[]>;
  protected readonly isLoadingContents$!: Observable<boolean>;
  learningTrailId!: string;
  steps!: Step[];

  constructor(
    private store: Store,
    private fuseLoadingService: FuseLoadingService,
  ) {
    this.learningTrail$ = this.store.select(learningTrailCreateFeature.selectLearningTrail).pipe(
      tap((learningTrail) => {
        this.steps = learningTrail?.steps ? [...learningTrail.steps] : [];
      }),
    );
    this.contents$ = this.store.select(learningTrailCreateFeature.selectContents);
    this.isLoadingContents$ = this.store.select(learningTrailCreateFeature.selectLoadingContents);
  }

  onLoadContents(search: string) {
    if (!search) {
      return;
    }
    this.store.dispatch(LearningTrailCreateActions.loadContents({ search }));
  }

  onCreateContent(content: CreateLearnContentEvent) {
    this.fuseLoadingService.show();
    const { id, content_type, order } = content;
    const payload = { learning_trail: this.learningTrailId, order };
    if (content_type === 'pulse') {
      payload['pulse'] = id;
    } else {
      payload['mission'] = id;
    }

    this.store.dispatch(LearningTrailCreateActions.postLearningTrailContent(payload));
  }

  orderSteps(contents: ContentStep[]): { step_id: string; order: number }[] {
    return this.steps.map((step) => {
      return {
        step_id: step.id,
        order: contents.findIndex((content) => content.id === step[step.mission ? 'mission' : 'pulse'].id),
      };
    });
  }

  onDropContent({ contents }: { contents: ContentStep[] }) {
    this.store.dispatch(LearningTrailCreateActions.updateLearningTrailContent({ steps: this.orderSteps(contents) }));
    this.steps.sort(
      (previousStep, currentStep) =>
        contents.findIndex((content) => content.id === previousStep[previousStep.mission ? 'mission' : 'pulse'].id) -
        contents.findIndex((content) => content.id === currentStep[currentStep.mission ? 'mission' : 'pulse'].id),
    );
  }

  onRemoveContent(id: string) {
    this.fuseLoadingService.show();
    this.store.dispatch(
      LearningTrailCreateActions.deleteLearningTrailContent({ learningTrailId: this.learningTrailId, id }),
    );
  }

  next(): void {
    this.store.dispatch(LearningTrailCreateActions.nextStep());
  }

  previous(): void {
    this.store.dispatch(LearningTrailCreateActions.previousStep());
  }
}
