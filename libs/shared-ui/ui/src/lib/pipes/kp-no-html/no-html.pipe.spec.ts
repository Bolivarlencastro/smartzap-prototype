import { KpNoHtmlPipe } from './no-html.pipe';

describe('NoHtmlPipe', () => {
  let pipe: KpNoHtmlPipe;

  beforeEach(() => {
    pipe = new KpNoHtmlPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should remove HTML tags and non-breaking spaces', () => {
    const inputText = '<p>This is <b>some</b> <i>text</i> with&nbsp;HTML&nbsp;tags.</p>';
    const expectedOutput = 'This is some text withHTMLtags.';
    const transformedText = pipe.transform(inputText);
    expect(transformedText).toEqual(expectedOutput);
  });

  it('should handle undefined input', () => {
    const transformedText = pipe.transform(undefined);
    expect(transformedText).toEqual('');
  });

  it('should handle null input', () => {
    const transformedText = pipe.transform(null);
    expect(transformedText).toEqual('');
  });

  it('should handle empty string input', () => {
    const transformedText = pipe.transform('');
    expect(transformedText).toEqual('');
  });

  it('should handle input with no HTML tags or non-breaking spaces', () => {
    const inputText = 'This is a simple text.';
    const transformedText = pipe.transform(inputText);
    expect(transformedText).toEqual(inputText);
  });
});
