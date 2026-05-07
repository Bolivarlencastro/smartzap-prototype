import { KpContentIconName } from './kp-content-icon-name.pipe';

describe('KpContentIconName', () => {
  it('create an instance', () => {
    const pipe = new KpContentIconName();
    expect(pipe).toBeTruthy();
  });

  it('should return empty when pass an empty value', () => {
    const pipe = new KpContentIconName();
    const value = pipe.transform('');
    expect(value).toBe('');
  });

  it('when pass "question" should return "quiz" icon name', () => {
    const pipe = new KpContentIconName();
    const value = pipe.transform('question');
    expect(value).toBe('quiz');
  });

  it('when pass a nonexistent type should return "report_problem" icon name', () => {
    const pipe = new KpContentIconName();
    const value = pipe.transform('blablabla');
    expect(value).toBe('report_problem');
  });
});
