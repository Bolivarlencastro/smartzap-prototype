import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpActivityLogListComponent } from './kp-activity-log-list.component';

describe('KpActivityLogListComponent', () => {
  let component: KpActivityLogListComponent;
  let fixture: ComponentFixture<KpActivityLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpActivityLogListComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpActivityLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit export event', () => {
    const spy = jest.spyOn(component.export, 'emit');
    component.onExport('123');
    expect(spy).toHaveBeenCalledWith('123');
  });
});
