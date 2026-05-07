import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { kpAnimations } from '../../../animations';
import { KpQuizCardService } from '../kp-quiz.service';
import { KpQuizCardOptionsComponent } from '../options/kp-quiz-card-options.component';
import { Option } from '../model';

interface QuestionData {
  id: string;
  exam_question: string;
  options: Option[];
}

@Component({
  selector: 'kp-quiz-question',
  templateUrl: './kp-quiz-question.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: kpAnimations,
  imports: [KpQuizCardOptionsComponent],
})
export class KpQuizQuestionComponent {
  data!: { question: QuestionData };

  private readonly _service = inject(KpQuizCardService);

  onSelectOption(options: string[], question: QuestionData): void {
    this._service.selectOption({ id: question.id, options });
  }
}
