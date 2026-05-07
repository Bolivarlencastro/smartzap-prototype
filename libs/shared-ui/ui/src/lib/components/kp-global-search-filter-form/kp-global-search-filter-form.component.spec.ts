import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpGlobalSearchFilterFormComponent } from './kp-global-search-filter-form.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpSelectMenuTriggerComponent } from '../kp-select-menu';

describe('KpGlobalSearchFilterFormComponent', () => {
  let component: KpGlobalSearchFilterFormComponent;
  let fixture: ComponentFixture<KpGlobalSearchFilterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [KpGlobalSearchFilterFormComponent, KpSelectMenuTriggerComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(KpGlobalSearchFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit form', () => {
    const expectResult = {
      enrollmentStatus: ['COMPLETED'],
      categories: null,
      duedate: null,
      duration: null,
      enrollmentType: null,
      platforms: null,
    };
    const spy = jest.spyOn(component.formSubmit, 'emit');
    fixture.componentRef.setInput('activeFilters', { enrollmentStatus: ['COMPLETED'] });
    fixture.detectChanges();

    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(expectResult);
  });
});
