import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { MarkdownRendererComponent } from './markdown-renderer.component';

jest.mock('marked', () => ({
  marked: {
    parse: jest.fn(),
  },
}));

describe('MarkdownRendererComponent', () => {
  let component: MarkdownRendererComponent;
  let fixture: ComponentFixture<MarkdownRendererComponent>;
  let sanitizer: DomSanitizer;

  const mockedMarked = marked as jest.Mocked<typeof marked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownRendererComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    sanitizer = TestBed.inject(DomSanitizer);
    fixture = TestBed.createComponent(MarkdownRendererComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('markdown', '# Hello');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Signal Transformation', () => {
    it('should parse markdown and sanitize HTML automatically when input changes', () => {
      const mockMarkdown = '# Hello';
      const mockHtml = '<h1>Hello</h1>';
      const mockSafeHtml = '<b>Safe Hello</b>';

      mockedMarked.parse.mockReturnValue(mockHtml as any);
      const sanitizerSpy = jest.spyOn(sanitizer, 'bypassSecurityTrustHtml').mockReturnValue(mockSafeHtml as any);

      fixture.componentRef.setInput('markdown', mockMarkdown);
      fixture.detectChanges();

      expect(mockedMarked.parse).toHaveBeenCalledWith(mockMarkdown);
      expect(sanitizerSpy).toHaveBeenCalledWith(mockHtml);
      expect(component.safeHtml()).toBe(mockSafeHtml);
    });
  });

  describe('Formatting Scenarios', () => {
    const testCases = [
      { name: 'tables', md: '| a |', html: '<table>' },
      { name: 'lists', md: '- item', html: '<ul>' },
    ];

    testCases.forEach((t) => {
      it(`should correctly process ${t.name}`, () => {
        mockedMarked.parse.mockReturnValue(t.html as any);

        fixture.componentRef.setInput('markdown', t.md);
        fixture.detectChanges();

        expect(mockedMarked.parse).toHaveBeenCalledWith(t.md);
      });
    });
  });
});
