import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tracking } from 'app/main/courses/model/tracking';
import { TrackingListItemComponent } from './tracking-list-item.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('TrackingListItemComponent', () => {
  let component: TrackingListItemComponent;
  let fixture: ComponentFixture<TrackingListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingListItemComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingListItemComponent);
    component = fixture.componentInstance;
    component.tracking = {} as Tracking;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('handleResendLink', () => {
    it('should emit resendLink', () => {
      jest.spyOn(component.resendLink, 'emit');

      component.handleResendLink();

      expect(component.resendLink.emit).toHaveBeenCalled();
    });
  });
});
