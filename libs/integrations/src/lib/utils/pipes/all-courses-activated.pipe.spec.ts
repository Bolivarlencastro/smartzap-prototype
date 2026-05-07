import { AllCoursesActivatedPipe } from './all-courses-activated.pipe';

describe('AllCoursesActivatedPipe', () => {
  const cases: any[] = [
    [[{ isActive: true }, { isActive: false }], false],
    [[{ isActive: true }, { isActive: true }], true],
  ];

  test.each(cases)('should return the correct value when the configuration is " %p "', (items, expectedValue) => {
    const pipe = new AllCoursesActivatedPipe();
    const result = pipe.transform(items);
    expect(result).toBe(expectedValue);
  });
});
