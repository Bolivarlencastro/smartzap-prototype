import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpDataTableFilterComponent } from './kp-datatable-filter.component';

describe('KpDatatableFilterComponent', () => {
  let component: KpDataTableFilterComponent;
  let fixture: ComponentFixture<KpDataTableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpDataTableFilterComponent, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpDataTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should export data table', () => {
    const spy = jest.spyOn(component.exportEvent, 'emit');
    const format = 'pdf';
    component.exportDataTable(format);
    expect(spy).toHaveBeenCalledWith(format);
  });
});
