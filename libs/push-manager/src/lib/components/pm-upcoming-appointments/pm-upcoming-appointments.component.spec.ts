import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancelPush event with the campaign id', () => {
    const emitSpy = jest.spyOn(component.cancelPush, 'emit');
    component.cancelPush.emit('123');
    expect(emitSpy).toHaveBeenCalledWith('123');
  });

  it('should emit searchChange', () => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');
    component.searchChange.emit('test query');
    expect(emitSpy).toHaveBeenCalledWith('test query');
  });

  it('should emit sortChange', () => {
    const emitSpy = jest.spyOn(component.sortChange, 'emit');
    const sort: Sort = { active: 'scheduled_at', direction: 'desc' };
    component.sortChange.emit(sort);
    expect(emitSpy).toHaveBeenCalledWith(sort);
  });

  it('should emit pageChange', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    const event = { pageIndex: 2, pageSize: 25, length: 100 } as PageEvent;
    component.pageChange.emit(event);
    expect(emitSpy).toHaveBeenCalledWith(event);
  });
});
