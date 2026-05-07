import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmbedContentType } from '@core/model';
import { ActivityService } from '@core/services/activity.service';
import { KpViewerKonquestComponent } from './kp-viewer-konquest.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { AnalyticsEventTypes } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpViewerKonquestComponent', () => {
  let component: KpViewerKonquestComponent;
  let fixture: ComponentFixture<KpViewerKonquestComponent>;
  let activityService: ActivityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpViewerKonquestComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: ActivityService,
          useValue: { registry: jest.fn(), update: jest.fn(), leave: jest.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    activityService = TestBed.inject(ActivityService);
    fixture = TestBed.createComponent(KpViewerKonquestComponent);
    component = fixture.componentInstance;
    component.url = 'https://www.google.com';
    fixture.detectChanges();
  });

  it('should call registry with LISTEN on content started with PODCAST', () => {
    component.contentType = EmbedContentType.Podcast;
    component.contentId = '123';

    component.onContentStarted();

    expect(activityService.registry).toHaveBeenCalledWith(
      { pulse: component.contentId },
      AnalyticsEventTypes.LISTEN,
      component.url,
    );
  });

  it('should call registry with WATCH on content started with VIDEO', () => {
    component.contentType = EmbedContentType.Video;
    fixture.detectChanges();
    component.contentId = '123';

    component.onPlayerStarted();

    expect(activityService.registry).toHaveBeenCalledWith(
      { pulse: component.contentId },
      AnalyticsEventTypes.WATCH,
      component.url,
    );
  });

  it('should call update if type is UPDATE', () => {
    component.onTrackingActivity('UPDATE');

    expect(activityService.update).toHaveBeenCalled();
  });

  it('should clear on paused', () => {
    component.contentType = EmbedContentType.Video;
    fixture.detectChanges();
    const clearSpy = jest.spyOn(component.trackerPlayer, 'clear');

    component.onPlayerPaused();

    expect(clearSpy).toHaveBeenCalled();
    expect(activityService.leave).toHaveBeenCalled();
  });

  it('should initialize the tracking as soon as possible if the tracker is not available when onContentStarted is called ', () => {
    component.contentType = EmbedContentType.Image;
    fixture.detectChanges();
    component.tracker = undefined;
    component.onContentStarted();
    component.tracker = { init: jest.fn() } as any;
    component.ngAfterViewInit();
    expect(component.tracker.init).toHaveBeenCalled();
  });
});
