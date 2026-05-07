import { KpDurationPipe } from './kp-duration.pipe';

describe('KpDurationPipe', () => {
  let pipe: KpDurationPipe;

  beforeEach(async () => {
    pipe = new KpDurationPipe();
  });

  it('When duration time pass 10 sec should return "10 s" ', () => {
    const value = pipe.transform(10);
    expect(value).toEqual('10 s');
  });

  it('When duration time pass 600 sec should return "10 min" ', () => {
    const value = pipe.transform(600);
    expect(value).toEqual('10 min');
  });

  it('When duration time pass 504 sec should return "8 min" ', () => {
    const value = pipe.transform(504);
    expect(value).toEqual('8 min');
  });

  it('When duration time pass 3600 sec should return "1 h" ', () => {
    const value = pipe.transform(3600);
    expect(value).toEqual('1 h 0 min');
  });
});
