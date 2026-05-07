import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmUpcomingAppointmentsComponent } from './pm-upcoming-appointments.component';

describe('PmUpcomingAppointmentsComponent', () => {
  let component: PmUpcomingAppointmentsComponent;
  let fixture: ComponentFixture<PmUpcomingAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmUpcomingAppointmentsComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmUpcomingAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit removePush event', () => {
    const emitSpy = jest.spyOn(component.removePush, 'emit');
    const id = '123';

    component.onRemovePush(id);

    expect(emitSpy).toHaveBeenCalledWith(id);
  });
});
