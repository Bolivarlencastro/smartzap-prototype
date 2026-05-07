import { Evaluation } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EvaluationService } from './evaluation.service';

describe('EvaluationService', () => {
  let service: EvaluationService;

  beforeEach(() => {
    service = new EvaluationService();
  });

  describe('formatEvaluations', () => {
    it('should format evaluations with valid questions_rating_avg', () => {
      const evaluations: Evaluation[] = [
        { questions_rating_avg: 4.567 },
        { questions_rating_avg: 3.2 },
      ] as unknown as Evaluation[];

      const result = service.formatEvaluations(evaluations);

      expect(result).toEqual([{ questions_rating_avg: '4.6' }, { questions_rating_avg: '3.2' }]);
    });

    it('should set questions_rating_avg to 0 if it is undefined or null', () => {
      const evaluations: Evaluation[] = [
        { questions_rating_avg: undefined },
        { questions_rating_avg: null },
      ] as unknown as Evaluation[];

      const result = service.formatEvaluations(evaluations);

      expect(result).toEqual([{ questions_rating_avg: 0 }, { questions_rating_avg: 0 }]);
    });

    it('should return an empty array if evaluations is empty', () => {
      const evaluations: Evaluation[] = [];

      const result = service.formatEvaluations(evaluations);

      expect(result).toEqual([]);
    });

    it('should handle undefined evaluations gracefully', () => {
      const result = service.formatEvaluations(undefined);

      expect(result).toEqual(undefined);
    });
  });
});
