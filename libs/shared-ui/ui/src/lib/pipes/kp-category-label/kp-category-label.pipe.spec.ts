import { KpCategoryLabelPipe } from './kp-category-label.pipe';

describe('CategoryLabelPipe', () => {
  let pipe: KpCategoryLabelPipe;

  beforeEach(async () => {
    pipe = new KpCategoryLabelPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should return custom name when does not exist translations to apply', () => {
    expect(pipe.transform('Custom Category Name')).toBe('Custom Category Name');
  });

  it('should return null if no value is given', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return the translation key if it is a standard category', () => {
    expect(pipe.transform('all')).toBe('UI.GENERAL.CATEGORY.all');
    expect(pipe.transform('Communications')).toBe('UI.GENERAL.CATEGORY.Communications');
    expect(pipe.transform('Design')).toBe('UI.GENERAL.CATEGORY.Design');
    expect(pipe.transform('Development')).toBe('UI.GENERAL.CATEGORY.Development');
    expect(pipe.transform('Digital Marketing')).toBe('UI.GENERAL.CATEGORY.Digital Marketing');
    expect(pipe.transform('Entrepreneurship')).toBe('UI.GENERAL.CATEGORY.Entrepreneurship');
    expect(pipe.transform('Finance')).toBe('UI.GENERAL.CATEGORY.Finance');
    expect(pipe.transform('Financial Education')).toBe('UI.GENERAL.CATEGORY.Financial Education');
    expect(pipe.transform('Health and Fitness')).toBe('UI.GENERAL.CATEGORY.Health and Fitness');
    expect(pipe.transform('Language')).toBe('UI.GENERAL.CATEGORY.Language');
    expect(pipe.transform('Leadership')).toBe('UI.GENERAL.CATEGORY.Leadership');
    expect(pipe.transform('Lifestyle')).toBe('UI.GENERAL.CATEGORY.Lifestyle');
    expect(pipe.transform('Management')).toBe('UI.GENERAL.CATEGORY.Management');
    expect(pipe.transform('Marketing')).toBe('UI.GENERAL.CATEGORY.Marketing');
    expect(pipe.transform('Office Productivity')).toBe('UI.GENERAL.CATEGORY.Office Productivity');
    expect(pipe.transform('Personal Development')).toBe('UI.GENERAL.CATEGORY.Personal Development');
    expect(pipe.transform('Project Management')).toBe('UI.GENERAL.CATEGORY.Project Management');
    expect(pipe.transform('Sales')).toBe('UI.GENERAL.CATEGORY.Sales');
    expect(pipe.transform('Social Media')).toBe('UI.GENERAL.CATEGORY.Social Media');
    expect(pipe.transform('Strategy')).toBe('UI.GENERAL.CATEGORY.Strategy');
    expect(pipe.transform('Technology')).toBe('UI.GENERAL.CATEGORY.Technology');
    expect(pipe.transform('Web Design')).toBe('UI.GENERAL.CATEGORY.Web Design');
  });
});
