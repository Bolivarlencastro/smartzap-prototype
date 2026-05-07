import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobModel } from '../../models';
import { JobListComponent } from './job-list.component';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const items: JobModel[] = [
  { id: '11', name: 'Job 11' },
  { id: '22', name: 'Job 22' },
  { id: '33', name: 'Job 33' },
];

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobListComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fill the table when the component receives the items', () => {
    const spy = jest.spyOn(component.selection, 'clear');
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    expect(component.dataSource.data).toBe(items);
    expect(spy).toHaveBeenCalled();
  });

  it('should select all rows or clear selection when checkbox is selected', () => {
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const spySelect = jest.spyOn(component.selection, 'select');
    const spyClear = jest.spyOn(component.selection, 'clear');
    const checkbox = fixture.debugElement.query(By.css('#selectAll')).nativeElement;
    checkbox.dispatchEvent(new Event('change'));
    expect(spySelect).toHaveBeenCalledWith(...component.dataSource.data);

    checkbox.dispatchEvent(new Event('change'));
    expect(spyClear).toHaveBeenCalled();
  });

  it('should open dialog', () => {
    const spy = jest.spyOn(component.openDialog, 'emit');
    const item = items[0];
    component.onOpenDialog(item);
    expect(spy).toHaveBeenCalledWith(item);
  });

  it('should delete one item', () => {
    const spy = jest.spyOn(component.deleteItem, 'emit');
    const id = '11';
    component.onDelete(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should delete many items', () => {
    const spy = jest.spyOn(component.deleteItem, 'emit');
    const ids = ['11', '22', '33'];
    component.selection.select(...items);

    component.onDelete();
    expect(spy).toHaveBeenCalledWith(ids);
  });
});
