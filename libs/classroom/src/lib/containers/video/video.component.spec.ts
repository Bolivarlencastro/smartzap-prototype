import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassVideoComponent } from './video.component';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ClassroomFacade } from '../../facades';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';

describe('ClassVideoComponent', () => {
  let component: ClassVideoComponent;
  let fixture: ComponentFixture<ClassVideoComponent>;
  let contentSubject: BehaviorSubject<LearnContent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;
  let translocoServiceMock: jest.Mocked<TranslocoService>;

  beforeEach(async () => {
    contentSubject = new BehaviorSubject({ url: 'mock_url' } as LearnContent);
    classroomFacadeMock = {
      content$: contentSubject.asObservable(),
      isViewingAsUser: signal(true),
      onActivityEvent: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;
    translocoServiceMock = {
      getActiveLang: jest.fn().mockReturnValue('pt-BR'),
    } as unknown as jest.Mocked<TranslocoService>;

    await TestBed.configureTestingModule({
      imports: [ClassVideoComponent, NoopAnimationsModule],
      providers: [
        { provide: ClassroomFacade, useValue: classroomFacadeMock },
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the activity track event', () => {
    component.onTrackingActivity('CREATE');
    expect(classroomFacadeMock.onActivityEvent).toHaveBeenCalledWith('CREATE');
  });

  it('should clear the when the content changes', () => {
    const contentUrl = 'https://content-url.com';
    const clearSpy = jest.spyOn(component.tracker, 'clear');
    contentSubject.next({ url: contentUrl, content_type: { name: 'Video' } } as LearnContent);

    expect(clearSpy).toHaveBeenCalled();
  });
});
