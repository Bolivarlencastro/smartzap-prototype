import { KpPopupBgImagePipe } from './kp-popup-bg-image.pipe';

describe('KpPopupBgImagePipe', () => {
  let pipe: KpPopupBgImagePipe;

  beforeEach(async () => {
    pipe = new KpPopupBgImagePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return item url', () => {
    const holder_image = 'test';
    const item = { holder_image };
    expect(pipe.transform(item, 'mission')).toBe(`url(${holder_image})`);
    expect(pipe.transform(item, 'learning-trail')).toBe(`url(${holder_image})`);
  });

  it('should return mission default url', () => {
    expect(pipe.transform(undefined, 'mission')).toBe(
      'url(https://assets.keepsdev.com/images/placeholders/default-card-bg.png)',
    );
  });

  it('should return learning trail default url', () => {
    expect(pipe.transform(undefined, 'learning-trail')).toBe('url(assets/images/trail-background.png)');
  });
});
