import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Frame } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { FrameOptionsComponent } from './frame-options.component';

const mockFrames = [
  { id: 'frame1', url: 'https://example.com/frame1.png', aspect_ratio: '3' },
  { id: 'frame2', url: 'https://example.com/frame2.png', aspect_ratio: '3' },
  { id: 'frame3', url: 'https://example.com/frame3.png', aspect_ratio: '3' },
] as Frame[];

describe('FrameOptionsComponent', () => {
  let component: FrameOptionsComponent;
  let fixture: ComponentFixture<FrameOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameOptionsComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FrameOptionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('frameOptions', mockFrames);
    fixture.componentRef.setInput('aspectRatio', 3);

    fixture.detectChanges();
  });

  describe('Frame Selection', () => {
    it('should select a frame and emit its URL', () => {
      const frameSelectedSpy = jest.spyOn(component.frameSelected, 'emit');
      const frameToSelect = mockFrames[1];

      component.selectFrame(frameToSelect);

      expect(component.isSelected(frameToSelect.id)).toBe(true);
      expect(frameSelectedSpy).toHaveBeenCalledWith(frameToSelect.url);
    });

    it('should select no-frame option and emit undefined', () => {
      const frameSelectedSpy = jest.spyOn(component.frameSelected, 'emit');

      component.selectFrame(null);

      expect(component.isSelected('')).toBe(true);
      expect(frameSelectedSpy).toHaveBeenCalledWith(undefined);
    });
  });
});
