import { Course } from '@app/main/courses/model';
import { StatusLabelPipe } from './status-label.pipe';

const courseMock: Course = {
  description: 'Descrição do curso',
  category_id: '1',
  lang: 'pt-br',
  name: 'Nome do curso',
  content_performance_weight: 1,
  quiz_performance_weight: 1,
  allow_content_anticipation: true,
  allow_drop_out: false,
  disable_send_certificate: false,
  is_active: true,
  status: 'CREATING',
};

describe('StatusLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusLabelPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get status label', () => {
    const pipe = new StatusLabelPipe();
    const course1 = courseMock;
    const course2 = { ...course1, is_active: false };
    expect(pipe.transform(course1)).toBe(`STATUS.${course1.status}`);
    expect(pipe.transform(course2)).toBe('STATUS.INACTIVE');
  });
});
