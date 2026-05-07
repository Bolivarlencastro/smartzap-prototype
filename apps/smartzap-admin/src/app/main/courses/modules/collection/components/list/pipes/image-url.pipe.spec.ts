import { ImageUrlPipe } from './image-url.pipe';

describe('ImageUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new ImageUrlPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get image url', () => {
    const pipe = new ImageUrlPipe();
    const url = 'https://assets.keepsdev.com/images/test';
    expect(pipe.transform(null)).toBe('https://assets.keepsdev.com/images/placeholders/default-card-bg.png');
    expect(pipe.transform(url)).toBe(url);
  });
});
