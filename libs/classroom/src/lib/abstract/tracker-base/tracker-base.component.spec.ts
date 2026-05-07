import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOADING_DELAY } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { TrackerBaseComponent } from './tracker-base.component';

@Component({
  template: ``,
  standalone: false,
})
class MockTrackerComponent extends TrackerBaseComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.tracker = {
      clear: jest.fn(),
      init: jest.fn(),
    };
  }

  callClear() {
    this.clear();
  }

  callInitTracker() {
    this.initTracker();
  }
}

describe('TrackerBaseComponent', () => {
  let component: MockTrackerComponent;
  let fixture: ComponentFixture<MockTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockTrackerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MockTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call tracker.clear when callClear() is called', () => {
    const clearSpy = jest.spyOn(component.tracker, 'clear');

    component.callClear();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should not call tracker.clear when tracker is undefined', () => {
    const clearSpy = jest.spyOn(component.tracker, 'clear');
    component.tracker = undefined;

    component.callClear();

    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('should call tracker.init after the default LOADING_DELAY when callInitTracker() is called', () => {
    const initSpy = jest.spyOn(component.tracker, 'init');

    component.callInitTracker();
    jest.advanceTimersByTime(LOADING_DELAY + 1);

    expect(initSpy).toHaveBeenCalled();
  });
});
