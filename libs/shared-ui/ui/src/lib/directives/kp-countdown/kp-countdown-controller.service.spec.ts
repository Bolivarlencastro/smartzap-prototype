import { KpCountdownControllerService } from './kp-countdown-controller.service';

describe('KpCountdownControllerService', () => {
  let service: KpCountdownControllerService;

  beforeEach(() => {
    service = new KpCountdownControllerService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit events on pause', (done) => {
    service.onPauseEvent.subscribe((paused) => {
      expect(paused).toBe(true);
      done();
    });

    service.pause();
  });

  it('should emit events on resume', (done) => {
    service.onPauseEvent.subscribe((paused) => {
      expect(paused).toBe(false);
      done();
    });

    service.resume();
  });
});
