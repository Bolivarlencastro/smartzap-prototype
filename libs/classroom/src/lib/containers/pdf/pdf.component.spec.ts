jest.mock('ngx-extended-pdf-viewer');
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassPDFComponent } from './pdf.component';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';
import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LOADING_DELAY } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { BehaviorSubject } from 'rxjs';
import { ClassroomFacade } from '../../facades';

describe('ClassPDFComponent', () => {
  let component: ClassPDFComponent;
  let fixture: ComponentFixture<ClassPDFComponent>;
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
      imports: [getTranslocoTestingModule(), ClassPDFComponent],
      providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ClassPDFComponent, { set: { schemas: [CUSTOM_ELEMENTS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(ClassPDFComponent);
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

  it('should emit the UPDATE activity track event on destroy', () => {
    component.ngOnDestroy();
    expect(classroomFacadeMock.onActivityEvent).toHaveBeenCalledWith('UPDATE');
  });

  it('should clear the tracker and initialize it after the default LOADING_DELAY when the content changes', () => {
    const contentUrl = 'https://content-url.com';
    const initSpy = jest.spyOn(component.tracker, 'init');
    const clearSpy = jest.spyOn(component.tracker, 'clear');
    contentSubject.next({ url: contentUrl, content_type: { name: 'Pdf' } } as LearnContent);

    jest.advanceTimersByTime(LOADING_DELAY + 1);

    expect(initSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });
});
