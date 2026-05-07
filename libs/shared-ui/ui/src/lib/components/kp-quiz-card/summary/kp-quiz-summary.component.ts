import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable, combineLatest, map } from 'rxjs';
import { kpAnimations } from '../../../animations';
import { KpQuizCardService, QuizSummary } from '../kp-quiz.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sw-kp-quiz-summary',
  templateUrl: './kp-quiz-summary.component.html',
  styleUrl: './kp-quiz-summary.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: kpAnimations,
  imports: [AsyncPipe, MatButton, MatIcon, TranslocoPipe, DecimalPipe, NgxSkeletonLoaderModule],
})
export class KpQuizSummaryComponent implements OnInit {
  private readonly _service = inject(KpQuizCardService);

  vm$!: Observable<{
    summary: QuizSummary;
    score: QuizScoreOutput | null;
    loadingScore: boolean;
    scorePercentage: number;
    showNextContent: boolean;
  }>;

  ngOnInit(): void {
    this.vm$ = combineLatest({
      summary: this._service.summary$,
      score: this._service.score$,
      loadingScore: this._service.loadingScore$,
      showNextContent: this._service.showNextContent$,
    }).pipe(
      map(({ summary, score, loadingScore, showNextContent }) => ({
        summary,
        score,
        loadingScore,
        showNextContent,
        scorePercentage:
          score && score.quiz_available_score > 0
            ? Math.round((score.quiz_awarded_score / score.quiz_available_score) * 100)
            : 0,
      })),
    );
  }

  nextContent(): void {
    this._service.nextContent();
  }

  goBack(): void {
    this._service.goBack();
  }
}
