import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpGlobalSearchSideFilterComponent } from './kp-global-search-side-filter.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { KpGlobalSearchFilterFormComponent } from '../kp-global-search-filter-form';

describe('KpGlobalSearchSideFilterComponent', () => {
  let component: KpGlobalSearchSideFilterComponent;
  let fixture: ComponentFixture<KpGlobalSearchSideFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [KpGlobalSearchSideFilterComponent, KpGlobalSearchFilterFormComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(KpGlobalSearchSideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter', () => {
    const spy = jest.spyOn(component.filterEvent, 'emit');
    const filter = { enrollmentStatus: ['COMPLETED'] };
    component.filter(filter);
    expect(spy).toHaveBeenCalledWith(filter);
  });

  it('should clean filter', () => {
    const spy = jest.spyOn(component.cleanFilterEvent, 'emit');
    component.cleanFilter();
    expect(spy).toHaveBeenCalled();
  });
});
