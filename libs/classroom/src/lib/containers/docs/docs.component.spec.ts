import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassDocsComponent } from './docs.component';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ClassroomFacade } from '../../facades';
import { LOADING_DELAY } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';

describe('ClassDocsComponent', () => {
  let component: ClassDocsComponent;
  let fixture: ComponentFixture<ClassDocsComponent>;
  let contentSubject: BehaviorSubject<LearnContent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;

  beforeEach(async () => {
    contentSubject = new BehaviorSubject({ url: 'mock_url' } as LearnContent);
    classroomFacadeMock = {
      content$: contentSubject.asObservable(),
      isViewingAsUser: signal(true),
      onActivityEvent: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;

    await TestBed.configureTestingModule({
      imports: [ClassDocsComponent],
      providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should emit the activity track event', () => {
    component.onTrackingActivity('CREATE');
    expect(classroomFacadeMock.onActivityEvent).toHaveBeenCalledWith('CREATE');
  });

  it('should clear the tracker and initialize it after the default LOADING_DELAY when the content changes', () => {
    const contentUrl = 'https://content-url.com';
    const initSpy = jest.spyOn(component.tracker, 'init');
    const clearSpy = jest.spyOn(component.tracker, 'clear');
    contentSubject.next({ url: contentUrl, content_type: { name: 'Text' } } as LearnContent);

    jest.advanceTimersByTime(LOADING_DELAY + 1);

    expect(initSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should return true if displaying content in the microsoft viewer', () => {
    const mockUrl = 'https://contents-stage.keepsdev.com/9c10c89fa3a0.pdf';
    expect(component.usingOfficeViewer(mockUrl)).toBe(true);
  });
});
