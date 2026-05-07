import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpAudioPlayerComponent } from './kp-audio-player.component';
import { EventEmitter } from '@angular/core';

describe('KpAudioPlayerComponent', () => {
  let component: KpAudioPlayerComponent;
  let fixture: ComponentFixture<KpAudioPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpAudioPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpAudioPlayerComponent);
    component = fixture.componentInstance;
    component.played = new EventEmitter<void>();
    component.paused = new EventEmitter<void>();
  });

  it('should initialize component state on ngOnInit', () => {
    component.url = 'https://example.com/audio.mp3';
    component.ngOnInit();
    expect(component['audioUrl']).toBe('https://example.com/audio.mp3');
    expect(component['isSoundCloud']).toBe(false);
  });

  it('should update component state when url changes', () => {
    component.url = 'https://soundcloud.com/example';
    component.ngOnChanges({
      url: {
        currentValue: 'https://soundcloud.com/example',
        firstChange: true,
        previousValue: undefined,
        isFirstChange: () => true,
      },
    });
    expect(component['audioUrl']).toBe('https://w.soundcloud.com/player/?url=https://soundcloud.com/example');
    expect(component['isSoundCloud']).toBe(true);
  });

  it('should emit played on onPlay', () => {
    const spy = jest.spyOn(component.played, 'emit');
    component.onPlay();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit paused on onPause', () => {
    const spy = jest.spyOn(component.paused, 'emit');
    component.onPause();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit played event for non-SoundCloud URLs', () => {
    const playedSpy = jest.spyOn(component.played, 'emit');
    component.url = 'https://example.com/audio.mp3';
    component.ngOnInit();
    expect(playedSpy).not.toHaveBeenCalled();
  });

  it('should return true for SoundCloud URL in isSoundCloudUrl', () => {
    const result = component.isSoundCloudUrl('https://soundcloud.com/example');
    expect(result).toBe(true);
  });

  it('should return false for non-SoundCloud URL in isSoundCloudUrl', () => {
    const result = component.isSoundCloudUrl('https://example.com');
    expect(result).toBe(false);
  });

  it('should return SoundCloud player URL for valid SoundCloud URL in buildSoundCloudPlayerUrl', () => {
    const result = component.buildSoundCloudPlayerUrl('https://soundcloud.com/example');
    expect(result).toBe('https://w.soundcloud.com/player/?url=https://soundcloud.com/example');
  });
});
