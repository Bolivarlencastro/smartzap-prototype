import { ClassAudioComponent } from './audio.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ClassroomFacade } from '../../facades';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LOADING_DELAY } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';

describe('ClassAudioComponent', () => {
  let component: ClassAudioComponent;
  let fixture: ComponentFixture<ClassAudioComponent>;
  let contentSubject: Subject<LearnContent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;

  beforeEach(async () => {
    contentSubject = new BehaviorSubject({ url: 'mock_url' } as LearnContent);
    classroomFacadeMock = {
      content$: contentSubject.asObservable(),
      isViewingAsUser: signal(true),
      onActivityEvent: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;

    await TestBed.configureTestingModule({
      imports: [ClassAudioComponent],
      providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should build the SoundCloud', (done) => {
    const contentUrl = 'https://soundcloud.com/creator/content-name';
    component.url$.subscribe((url) => {
      expect(url).toBe(`https://w.soundcloud.com/player/?url=${contentUrl}`);
      done();
    });

    contentSubject.next({ url: contentUrl } as LearnContent);
  });

  it('should return the unmodified content url if it is not from SoundCloud', (done) => {
    const contentUrl = 'https://contents-stage.keepsdev.com/content-path';
    component.url$.subscribe((url) => {
      expect(url).toBe(contentUrl);
      done();
    });

    contentSubject.next({ url: contentUrl } as LearnContent);
  });

  it('should init the tracker after the default LOADING_DELAY when the content is from SoundCloud', () => {
    const contentUrl = 'https://soundcloud.com/creator/content-name';
    contentSubject.next({ url: contentUrl } as LearnContent);
    fixture.detectChanges();
    const initSpy = jest.spyOn(component.tracker, 'init');

    jest.advanceTimersByTime(LOADING_DELAY + 1);
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear the tracker when the content url changes', () => {
    const contentUrl = 'https://soundcloud.com/creator/content-name';
    contentSubject.next({ url: contentUrl } as LearnContent);
    fixture.detectChanges();
    const clearSpy = jest.spyOn(component.tracker, 'clear');
    contentSubject.next({ url: contentUrl } as LearnContent);

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit the activity track event', () => {
    component.onTrackingActivity('CREATE');
    expect(classroomFacadeMock.onActivityEvent).toHaveBeenCalledWith('CREATE');
  });
});
