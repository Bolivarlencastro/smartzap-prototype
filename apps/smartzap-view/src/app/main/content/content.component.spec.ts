import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityService, ContentService, ProgressBarService } from '@core/services';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ActivityContentTypes, Tracker } from '@keeps-platform-frontend-workspace/ui/kp-viewer';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  let mockActivatedRoute: any;
  let mockProgressBarService: any;
  let mockActivityService: any;
  let mockExamService: any;
  let mockWorkspaceService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jest.fn().mockReturnValue('123456789'),
        },
      },
      data: of({ data: { exam_type: 'SURVEY', user_answers: [] } }),
    };

    mockProgressBarService = {
      show: jest.fn(),
      hide: jest.fn(),
    };

    mockActivityService = {
      getActivityId: jest.fn().mockReturnValue('activity-123'),
      registry: jest.fn().mockReturnValue(of({})),
      leave: jest.fn().mockReturnValue(of({})),
      return: jest.fn(),
    };

    mockExamService = {
      createAnswerer: jest.fn().mockReturnValue(of({ id: 'answer-123' })),
    };

    mockWorkspaceService = {
      getCurrentWorkspace: jest.fn().mockReturnValue({ icon_url: 'workspace-icon-url' }),
    };

    await TestBed.configureTestingModule({
      declarations: [ContentComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProgressBarService, useValue: mockProgressBarService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: ContentService, useValue: mockExamService },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('close()', () => {
    it('should call window.close', () => {
      const mockClose = jest.fn();
      Object.defineProperty(window, 'close', { value: mockClose, writable: true });

      component.close();

      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('onTracker()', () => {
    it('should call activityService.registry with tracker', () => {
      const mockTracker: Tracker = {
        contentId: 'content-123',
        contentType: ActivityContentTypes.Video,
        event: { type: 'PLAY', timestamp: Date.now() },
      };

      component.onTracker(mockTracker);

      expect(mockActivityService.registry).toHaveBeenCalledWith(mockTracker);
      expect(mockActivityService.registry).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to registry observable', () => {
      const mockTracker: Tracker = {
        contentId: 'content-123',
        contentType: ActivityContentTypes.Video,
        event: { type: 'PAUSE', timestamp: Date.now() },
      };

      const registrySpy = jest.spyOn(mockActivityService.registry(mockTracker), 'subscribe');

      component.onTracker(mockTracker);

      expect(registrySpy).toHaveBeenCalled();
    });
  });

  describe('updateQuizObject()', () => {
    it('should add new answer to user_answers array', () => {
      const oldAnswer = { id: 'answer-1', questionId: 'q1', text: 'Answer 1' };
      component.data = {
        exam_type: 'SURVEY',
        user_answers: [oldAnswer],
      };

      const newAnswer = [{ id: 'answer-2', questionId: 'q2', text: 'Answer 2' }];

      component.updateQuizObject(newAnswer);

      expect(component.data.user_answers).toEqual([oldAnswer, ...newAnswer]);
      expect(component.data.user_answers.length).toBe(2);
      expect(component.data.exam_type).toBe('SURVEY');
    });

    it('should create user_answers array if it does not exist', () => {
      component.data = { exam_type: 'SURVEY', user_answers: [] };

      const newAnswer = [{ id: 'answer-1', questionId: 'q1', text: 'Answer 1' }];

      component.updateQuizObject(newAnswer);

      expect(component.data.user_answers).toBeDefined();
      expect(component.data.user_answers).toEqual(newAnswer);
      expect(component.data.user_answers.length).toBe(1);
    });
  });

  describe('onReturn()', () => {
    it('should call leave and return when activityId exists', () => {
      const mockUrl = 'https://example.com/return';
      component.activityId = 'activity-123';

      component.onReturn(mockUrl);

      expect(mockActivityService.leave).toHaveBeenCalled();
      expect(mockActivityService.return).toHaveBeenCalledWith(mockUrl);
    });

    it('should call only return when activityId does not exist', () => {
      const mockUrl = 'https://example.com/return';
      component.activityId = '';

      component.onReturn(mockUrl);

      expect(mockActivityService.leave).not.toHaveBeenCalled();
      expect(mockActivityService.return).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('getReturnPhone()', () => {
    let mockParamMap: jest.Mocked<ParamMap>;

    beforeEach(() => {
      mockParamMap = {
        get: jest.fn(),
        has: jest.fn(),
        getAll: jest.fn(),
        keys: [],
      };
    });

    it('should return whatsapp url when phone is provided', () => {
      mockParamMap.get.mockReturnValue('11999999999');

      const result = component['getReturnPhone'](mockParamMap);

      expect(result).toBe('https://wa.me/11999999999');
    });

    it('should return environment whatsapp url when phone is "None"', () => {
      mockParamMap.get.mockReturnValue('None');

      const result = component['getReturnPhone'](mockParamMap);

      expect(result).toBe(environment.whatsappUrlRedirect);
    });

    it('should return environment whatsapp url when phone is null', () => {
      mockParamMap.get.mockReturnValue(null);

      const result = component['getReturnPhone'](mockParamMap);

      expect(result).toBe(environment.whatsappUrlRedirect);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize component properties correctly', () => {
      expect(component.activityId).toBe('activity-123');
      expect(component.workspaceIconUrl).toBe('workspace-icon-url');
      expect(component.redirectUrl).toBe('https://wa.me/123456789');
    });

    it('should set isSurveyQuiz based on exam_type', () => {
      expect(component.isSurveyQuiz).toBe(true);

      mockActivatedRoute.data = of({ data: { exam_type: 'QUIZ', user_answers: [] } });
      component.ngOnInit();

      expect(component.isSurveyQuiz).toBe(false);
    });

    it('should set data from route resolver', () => {
      const mockData = { exam_type: 'EXAM', user_answers: [], questions: [] };
      mockActivatedRoute.data = of({ data: mockData });

      component.ngOnInit();

      expect(component.data).toEqual(mockData);
    });
  });

  describe('Component Properties', () => {
    it('should have correct initial values', () => {
      expect(component.type).toBe(ActivityContentTypes);
      expect(component.supportUrl).toBe(environment.keepsSupport);
    });

    it('should have ActivityContentTypes enum available', () => {
      expect(component.type).toBeDefined();
      expect(component.type.Video).toBeDefined();
      expect(component.type.Text).toBeDefined();
    });
  });
});
