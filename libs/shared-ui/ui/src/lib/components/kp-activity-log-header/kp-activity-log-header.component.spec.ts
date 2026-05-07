import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KpActivityLogHeaderComponent } from './kp-activity-log-header.component';
import { ActivityLogFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

describe('KpActivityLogHeaderComponent', () => {
  let component: KpActivityLogHeaderComponent;
  let fixture: ComponentFixture<KpActivityLogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpActivityLogHeaderComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpActivityLogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit filter event', () => {
    const spy = jest.spyOn(component.filter, 'emit');
    const value: ActivityLogFilter = {
      createdDateGte: new Date(),
      createdDateLte: null,
      userId: null,
      actionKey: null,
      status: 'READY',
    };
    component.filterForm.setValue(value);
    fixture.detectChanges();

    component.onFilter();

    expect(spy).toHaveBeenCalledWith(value);
  });
});
