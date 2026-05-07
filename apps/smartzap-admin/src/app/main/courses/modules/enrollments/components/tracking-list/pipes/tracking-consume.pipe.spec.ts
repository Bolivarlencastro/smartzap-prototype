import { Tracking } from 'app/main/courses/model/tracking';
import { TrackingConsumePipe } from './tracking-consume.pipe';

describe('TrackingConsumePipe', () => {
  it('create an instance', () => {
    const pipe = new TrackingConsumePipe();
    expect(pipe).toBeTruthy();
  });

  it('should get learn consume text', () => {
    const tracking = {
      learn_duration: 100,
      duration: 60,
    };
    const pipe = new TrackingConsumePipe();
    expect(pipe.transform(tracking as Tracking)).toEqual('1min');
  });

  it('should get questions consume text', () => {
    const tracking = {
      total_questions: 10,
      total_correct_answers: 5,
    };
    const pipe = new TrackingConsumePipe();
    expect(pipe.transform(tracking as Tracking)).toEqual('5/10');
  });
});
