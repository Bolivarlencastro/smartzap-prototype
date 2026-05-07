import { VimeoUrlFilterPipe } from './vimeo-url-filter.pipe';

describe('VimeoUrlFilterPipe', () => {
  let pipe: VimeoUrlFilterPipe;

  beforeEach(() => {
    pipe = new VimeoUrlFilterPipe();
  });

  it('should remove the share query parameter from a video', () => {
    expect(pipe.transform('https://vimeo.com/913389735/fabd6709a5?share=copy')).toEqual(
      'https://vimeo.com/913389735/fabd6709a5',
    );
  });

  it('should return the same url if is not vimeo', () => {
    expect(pipe.transform('https://www.youtube.com/watch?v=uLaeGVBkzKs')).toEqual(
      'https://www.youtube.com/watch?v=uLaeGVBkzKs',
    );
  });

  it('should handle undefined urls', () => {
    expect(pipe.transform(undefined)).toEqual(undefined);
  });
});
