import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpImageViewerComponent } from './kp-image-viewer.component';
import { FullScreenViewer } from 'iv-viewer';

jest.mock('iv-viewer', () => ({
  FullScreenViewer: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    destroy: jest.fn(),
  })),
}));

describe('KpImageViewerComponent', () => {
  let component: KpImageViewerComponent;
  let fixture: ComponentFixture<KpImageViewerComponent>;

  beforeEach(async () => {
    (FullScreenViewer as jest.Mock).mockClear();

    await TestBed.configureTestingModule({
      imports: [KpImageViewerComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpImageViewerComponent);
    component = fixture.componentInstance;
    component.url = 'https://example.com/image.png';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create a FullScreenViewer when enableFullscreen is true', () => {
      component.enableFullscreen = true;
      fixture.detectChanges();
      expect(FullScreenViewer).toHaveBeenCalledTimes(1);
    });

    it('should not create a FullScreenViewer when enableFullscreen is false', () => {
      component.enableFullscreen = false;
      fixture.detectChanges();
      expect(FullScreenViewer).not.toHaveBeenCalled();
    });

    it('should emit started on init', () => {
      const startedSpy = jest.spyOn(component.started, 'emit');
      fixture.detectChanges();
      expect(startedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroy on the viewer when it exists', () => {
      component.enableFullscreen = true;
      fixture.detectChanges();
      const viewerInstance = (FullScreenViewer as jest.Mock).mock.results[0].value;

      component.ngOnDestroy();

      expect(viewerInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should not throw when viewer does not exist (enableFullscreen false)', () => {
      component.enableFullscreen = false;
      fixture.detectChanges();

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('onClick', () => {
    it('should call viewer.show with the url', () => {
      component.enableFullscreen = true;
      fixture.detectChanges();
      const viewerInstance = (FullScreenViewer as jest.Mock).mock.results[0].value;

      component.onClick();

      expect(viewerInstance.show).toHaveBeenCalledWith('https://example.com/image.png');
    });

    it('should do nothing when url is not set', () => {
      component.enableFullscreen = true;
      component.url = '';
      fixture.detectChanges();
      const viewerInstance = (FullScreenViewer as jest.Mock).mock.results[0].value;

      component.onClick();

      expect(viewerInstance.show).not.toHaveBeenCalled();
    });

    it('should do nothing when enableFullscreen is false', () => {
      component.enableFullscreen = false;
      fixture.detectChanges();

      expect(() => component.onClick()).not.toThrow();
    });
  });

  describe('host binding', () => {
    it('should add fullscreen-enabled class when enableFullscreen is true', () => {
      component.enableFullscreen = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('fullscreen-enabled');
    });

    it('should not add fullscreen-enabled class when enableFullscreen is false', () => {
      component.enableFullscreen = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).not.toContain('fullscreen-enabled');
    });
  });
});
