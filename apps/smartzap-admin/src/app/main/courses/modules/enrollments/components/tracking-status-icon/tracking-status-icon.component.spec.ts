import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingStatusIconComponent } from './tracking-status-icon.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('TrackingStatusIconComponent', () => {
  let component: TrackingStatusIconComponent;
  let fixture: ComponentFixture<TrackingStatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingStatusIconComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('deliverStatus', () => {
    it('should return delivered when status is delivered', () => {
      component.status = 'DELIVERED';

      const result = component.deliverStatus;

      expect(result).toEqual('DELIVERED');
    });

    it('should return delivered when status is sent', () => {
      component.status = 'SENT';

      const result = component.deliverStatus;

      expect(result).toEqual('DELIVERED');
    });

    it('should return waiting when status is pending', () => {
      component.status = 'PENDING';

      const result = component.deliverStatus;

      expect(result).toEqual('WAITING');
    });

    it('should return error when status is not delivered or sent or pending', () => {
      component.status = 'FAILED';

      const result = component.deliverStatus;

      expect(result).toEqual('ERROR');
    });
  });

  describe('deliverStatusColor', () => {
    it('should return correct color when deliverStatus is DELIVERED', () => {
      jest.spyOn(component, 'deliverStatus', 'get').mockReturnValue('DELIVERED');

      const result = component.deliverStatusColor;

      expect(result).toEqual('#4dc8ac');
    });

    it('should return correct color when deliverStatus is WAITING', () => {
      jest.spyOn(component, 'deliverStatus', 'get').mockReturnValue('WAITING');

      const result = component.deliverStatusColor;

      expect(result).toEqual('#f8b31b');
    });

    it('should return correct color when deliverStatus is ERROR', () => {
      jest.spyOn(component, 'deliverStatus', 'get').mockReturnValue('ERROR');

      const result = component.deliverStatusColor;

      expect(result).toEqual('#f47c52');
    });
  });

  describe('tooltipMessage', () => {
    it('should return tooltip message with deliverStatus', () => {
      jest.spyOn(component, 'deliverStatus', 'get').mockReturnValue('DELIVERED');

      const result = component.tooltipMessage;

      expect(result).toEqual('TRACKING.DELIVER_STATUS.DELIVERED');
    });
  });
});
