import { Course } from '@app/main/courses/model';
import { StatusColorPipe } from './status-color.pipe';

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

describe('StatusColorPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusColorPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get status color (inactivated)', () => {
    const pipe = new StatusColorPipe();
    const course = { ...courseMock, is_active: false };
    expect(pipe.transform(course)).toBe('#b5b5b5');
  });

  describe('getStatusColor (activated)', () => {
    const pipe = new StatusColorPipe();
    const cases: any[] = [
      ['#01d89b', 'FINISHED'],
      ['#ff9706', 'REVIEWING'],
      ['#e1b258', 'PROCESSING'],
      ['#ff7152', 'CREATING'],
      [undefined, 'NON-EXISTENT_STATUS'],
    ];
    test.each(cases)('should return the status color %p for status %p', (expectedColor, status) => {
      const course = { ...courseMock, status };
      const color: string = pipe.transform(course);
      expect(color).toBe(expectedColor);
    });
  });
});
