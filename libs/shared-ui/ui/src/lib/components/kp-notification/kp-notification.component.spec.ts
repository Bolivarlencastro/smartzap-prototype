import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpNotificationComponent } from './kp-notification.component';

describe('KpNotificationComponent', () => {
  let component: KpNotificationComponent;
  let fixture: ComponentFixture<KpNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpNotificationComponent);
    component = fixture.componentInstance;
    component.notifications = null;
    fixture.detectChanges();
  });

  it('should emit deleteAll', () => {
    const deleteAllSpy = jest.spyOn(component.readAll, 'emit');

    component.onReadAll();

    expect(deleteAllSpy).toHaveBeenCalled();
  });
});
