import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { KpCourseFilterComponent } from './kp-course-filter.component';

describe('KpCourseFilterComponent', () => {
  let component: KpCourseFilterComponent;
  let fixture: ComponentFixture<KpCourseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpCourseFilterComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpCourseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterEvent with selected languages', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component['form'].patchValue({ languages: ['pt-BR', 'en'], categories: [], statuses: [] });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({ languages: ['pt-BR', 'en'], categories: [], statuses: [] });
  }));

  it('should emit filterEvent with selected categories', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component['form'].patchValue({ languages: [], categories: ['cat-1', 'cat-2'], statuses: [] });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({ languages: [], categories: ['cat-1', 'cat-2'], statuses: [] });
  }));

  it('should emit filterEvent with selected statuses', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component['form'].patchValue({ languages: [], categories: [], statuses: ['CREATING', 'FINISHED'] });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({ languages: [], categories: [], statuses: ['CREATING', 'FINISHED'] });
  }));

  it('should patch initial filters on init', () => {
    fixture.componentRef.setInput('filters', { languages: ['es'], categories: ['cat-1'], statuses: ['REVIEWING'] });
    component.ngOnInit();

    expect(component['form'].value.languages).toEqual(['es']);
    expect(component['form'].value.categories).toEqual(['cat-1']);
    expect(component['form'].value.statuses).toEqual(['REVIEWING']);
  });
});
