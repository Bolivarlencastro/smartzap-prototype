import { KpMediaPlayerStorageService } from './kp-media-player-storage.service';
import { LocalMediaStorage } from 'vidstack';

describe('KpMediaPlayerStorageService', () => {
  let service: KpMediaPlayerStorageService;

  beforeEach(() => {
    service = new KpMediaPlayerStorageService();
  });

  it('should set the playback speed on the service', async () => {
    const setPlaybackSpeedSpy = jest.spyOn(LocalMediaStorage.prototype, 'setPlaybackRate');

    await service.setPlaybackRate(2);

    expect(service.playbackRate).toBe(2);
    expect(setPlaybackSpeedSpy).toHaveBeenCalledWith(2);
  });

  it('should set the playback speed on the service when retrieving it', async () => {
    jest.spyOn(LocalMediaStorage.prototype, 'getPlaybackRate').mockResolvedValue(10);

    const playbackSpeed = await service.getPlaybackRate();

    expect(playbackSpeed).toBe(10);
    expect(service.playbackRate).toBe(10);
  });
});
