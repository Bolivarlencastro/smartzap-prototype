import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClassScormComponent } from './scorm.component';
import { ClassroomFacade } from '../../facades';
import { APPLICATION_DOMAIN, CMI, LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ScormUrlResolver } from '../../services/scorm/scorm-url.resolver';

const callBacks: Map<string, () => void> = new Map();
const mockCmi = { core: { student_id: 'id' } } as unknown as CMI;

jest.mock('scorm-again', () => ({
  Scorm12API: jest.fn().mockImplementation(() => ({
    loadFromJSON: jest.fn(),
    reset: jest.fn(),
    on: jest.fn().mockImplementation((eventName: string, callback: () => void) => callBacks.set(eventName, callback)),
    renderCMIToJSONObject: jest.fn().mockReturnValue({ cmi: mockCmi }),
  })),
}));

describe('ClassScormComponent', () => {
  let component: ClassScormComponent;
  let fixture: ComponentFixture<ClassScormComponent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;
  let content$: BehaviorSubject<LearnContent | undefined>;
  let scormCMI$: BehaviorSubject<CMI | undefined>;
  let scormStream$: Subject<any>;
  let scormUrlResolverMock: jest.Mocked<ScormUrlResolver>;

  beforeEach(async () => {
    content$ = new BehaviorSubject<LearnContent | undefined>(undefined);
    scormCMI$ = new BehaviorSubject<CMI | undefined>(undefined);
    scormStream$ = new Subject<any>();
    scormUrlResolverMock = {
      resolveUrl: jest.fn().mockImplementation((url) => url),
    } as unknown as jest.Mocked<ScormUrlResolver>;
    callBacks.clear();

    classroomFacadeMock = {
      content$: content$.asObservable(),
      scormCMI$: scormCMI$.asObservable(),
      isViewingAsUser: signal(true),
      getScormCMIStream: jest.fn(() => scormStream$.asObservable()),
      loadScormCMI: jest.fn(),
      storeLastEmittedScormCMI: jest.fn(),
      saveScormCMI: jest.fn(),
      saveLastEmittedScormCMI: jest.fn(),
      onActivityEvent: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;

    await TestBed.configureTestingModule({
      imports: [ClassScormComponent],
      providers: [
        { provide: ClassroomFacade, useValue: classroomFacadeMock },
        { provide: ScormUrlResolver, useValue: scormUrlResolverMock },
        { provide: APPLICATION_DOMAIN, useValue: 'https://keeps.com' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ClassScormComponent, { set: { schemas: [CUSTOM_ELEMENTS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(ClassScormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the scorm API when the content and CMI are available', () => {
    const mockCmi = { core: { student_id: 'id' } } as unknown as CMI;
    const mockContent: LearnContent = { url: 'https://content-url.test' } as LearnContent;
    content$.next(mockContent);
    scormCMI$.next(mockCmi);
    fixture.detectChanges();

    expect(window.API?.loadFromJSON).toBeDefined();
  });

  it('should subscribe to SCORM CMI stream and call loadScormCMI on emissions', () => {
    expect(classroomFacadeMock.getScormCMIStream).toHaveBeenCalled();

    scormStream$.next(undefined);

    expect(classroomFacadeMock.loadScormCMI).toHaveBeenCalled();
  });

  it('should forward tracking activity events to the facade', () => {
    component.onTrackingActivity('CREATE');

    expect(classroomFacadeMock.onActivityEvent).toHaveBeenCalledWith('CREATE');
  });

  it('should save last emitted CMI on destroy', () => {
    component.ngOnDestroy();

    expect(classroomFacadeMock.saveLastEmittedScormCMI).toHaveBeenCalled();
  });

  describe('SCORM API events', () => {
    let postMessageSpy: jest.Mock;
    const mockCmi = { core: { student_id: 'id' } } as unknown as CMI;
    const mockContent: LearnContent = { url: 'https://content-url.test' } as LearnContent;

    beforeEach(() => {
      postMessageSpy = jest.fn();
      const nativeElement: any = { contentWindow: { postMessage: postMessageSpy } };
      component.iframe = new ElementRef<HTMLIFrameElement>(nativeElement);
      fixture.detectChanges();
    });

    it('should set the content url in the iframe', () => {
      content$.next(mockContent);
      scormCMI$.next(mockCmi);

      fixture.detectChanges();

      expect(component.iframe.nativeElement.src).toBe(mockContent.url);
    });

    it('should initialize the CMI and listeners, clear the tracker and init it when a new content and cmi are available', () => {
      const clearTrackerSpy = jest.spyOn(component.tracker, 'clear');
      const initSpy = jest.spyOn(component.tracker, 'init');

      content$.next(mockContent);
      scormCMI$.next(mockCmi);
      fixture.detectChanges();

      expect(window.API?.reset).toHaveBeenCalled();
      expect(window.API?.loadFromJSON).toHaveBeenCalledWith(mockCmi);
      expect(window.API.on).toHaveBeenCalledWith('LMSSetValue.cmi.*', expect.any(Function));
      expect(window.API.on).toHaveBeenCalledWith('LMSCommit', expect.any(Function));
      expect(clearTrackerSpy).toHaveBeenCalled();
      expect(initSpy).toHaveBeenCalled();
    });

    it('should handle LMSSetValue.cmi.* events emitted by the SCORM API', () => {
      content$.next(mockContent);
      scormCMI$.next(mockCmi);

      fixture.detectChanges();

      // We are calling the callback function directly
      callBacks.get('LMSSetValue.cmi.*')?.();

      expect(classroomFacadeMock.storeLastEmittedScormCMI).toHaveBeenCalledWith(mockCmi);
    });

    it('should handle LMSCommit events emitted by the SCORM API', () => {
      content$.next(mockContent);
      scormCMI$.next(mockCmi);
      fixture.detectChanges();

      // We are calling the callback function directly
      callBacks.get('LMSCommit')?.();

      expect(classroomFacadeMock.storeLastEmittedScormCMI).toHaveBeenCalledWith(mockCmi);
      expect(classroomFacadeMock.saveScormCMI).toHaveBeenCalledWith(mockCmi);
    });
  });
});
