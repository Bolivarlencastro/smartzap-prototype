import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpSelectCompleteComponent } from './kp-select-complete.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';
import { KpSelectCompleteOption } from './models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('KpSelectCompleteComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the formControl value when a option is selected', () => {
    component.singleSelect.selectionChange(component.options.at(0));
    // When in the multi status, the mat-select component emits all selected options in the selectionChange event
    component.multiSelect.selectionChange([component.options.at(1), component.options.at(2)]);
    const expectedFormValue = {
      singleControl: component.options.at(0).value,
      multiControl: [component.options.at(1).value, component.options.at(2).value],
    };
    expect(component.testForm.value).toMatchObject(expectedFormValue);
  });

  it('should emit the filter event', () => {
    const filterSpy = jest.spyOn(component, 'onFilter');
    component.singleSelect.filter('filter');

    expect(filterSpy).toHaveBeenCalledWith('filter');
  });

  it('should select all options on multi selects', () => {
    component.multiSelect.selectAll();

    expect(component.testForm.value).toMatchObject({ multiControl: ['option_1', 'option_2', 'option_3'] });
  });

  it('should clear the selection', () => {
    component.multiSelect.selectAll();
    expect(component.testForm.value.multiControl.length).toBe(3);
    component.multiSelect.clearSelection();
    expect(component.testForm.value.multiControl).toMatchObject([]);
  });
});

@Component({
  imports: [KpSelectCompleteComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="testForm">
      <kp-select-complete
        #singleSelect
        formControlName="singleControl"
        [options]="options"
        (filterChange)="onFilter($event)"
      ></kp-select-complete>
      <kp-select-complete
        #multiSelect
        formControlName="multiControl"
        multiple
        [options]="options"
        (filterChange)="onFilter($event)"
      ></kp-select-complete>
    </form>
  `,
})
class TestHostComponent {
  options: KpSelectCompleteOption[] = [
    { label: 'first_option', value: 'option_1' },
    {
      label: 'second_option',
      value: 'option_2',
    },
    {
      label: 'third_option',
      value: 'option_3',
    },
  ];

  testForm = new FormGroup({
    singleControl: new FormControl(),
    multiControl: new FormControl(['option_2']),
  });

  @ViewChild('singleSelect') singleSelect: KpSelectCompleteComponent;
  @ViewChild('multiSelect') multiSelect: KpSelectCompleteComponent;

  onFilter(_filter: string) {
    return;
  }
}
