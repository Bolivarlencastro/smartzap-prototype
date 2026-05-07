import { Tracking } from 'app/main/courses/model/tracking';
import { TrackingPercentagePipe } from './tracking-percentage.pipe';

describe('Tracking.PercentagePipe', () => {
  it('create an instance', () => {
    const pipe = new TrackingPercentagePipe();
    expect(pipe).toBeTruthy();
  });

  it('should get learn percentage', () => {
    const tracking = {
      learn_duration: 100,
      duration: 50,
    };
    const pipe = new TrackingPercentagePipe();
    expect(pipe.transform(tracking as Tracking)).toEqual(0.5);
  });

  it('should get questions percentage', () => {
    const tracking = {
      total_questions: 10,
      total_correct_answers: 5,
    };
    const pipe = new TrackingPercentagePipe();
    expect(pipe.transform(tracking as Tracking)).toEqual(0.5);
  });
});
