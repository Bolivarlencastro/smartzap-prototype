import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpSelectMenuTriggerComponent } from './kp-select-menu-trigger.component';
import { KpSelectTriggerContentDirective } from './kp-select-trigger-content.directive';
import { Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';

describe('KpSelectMenuComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the select width to null', () => {
    expect(component.singleSelect.panelWidth).toBeNull();
    expect(component.multiSelect.panelWidth).toBeNull();
  });

  it('should return whether the select has selection or not', () => {
    component.singleControl.setValue('value_1');
    component.multiControl.setValue(['value_1', 'value_2']);

    fixture.detectChanges();

    expect(component.singleTrigger.hasSelection).toBe(true);
    expect(component.multiTrigger.hasSelection).toBe(true);
  });

  it('should clear the formControl value', () => {
    component.singleControl.setValue('value_1');
    component.multiControl.setValue(['value_1', 'value_2']);

    component.singleTrigger.clearSelection();
    component.multiTrigger.clearSelection();

    expect(component.singleControl.value).toBeNull();
    expect(component.multiControl.value).toBeNull();
  });
});

@Component({
  template: `
    <kp-select-menu-trigger #singleTrigger>
      <mat-select #singleSelect kpSelectTriggerContent [formControl]="singleControl">
        <mat-option [value]="'value_1'">
          <span>option 1</span>
        </mat-option>
        <mat-option [value]="'value_2'">
          <span>option 1</span>
        </mat-option>
      </mat-select>
    </kp-select-menu-trigger>

    <kp-select-menu-trigger #multiTrigger>
      <mat-select #multiSelect kpSelectTriggerContent multiple [formControl]="multiControl">
        <mat-option [value]="'value_1'">
          <span>option 1</span>
        </mat-option>
        <mat-option [value]="'value_2'">
          <span>option 1</span>
        </mat-option>
      </mat-select>
    </kp-select-menu-trigger>
  `,
  imports: [KpSelectMenuTriggerComponent, MatSelect, ReactiveFormsModule, KpSelectTriggerContentDirective, MatOption],
})
class TestHostComponent {
  @ViewChild('singleTrigger') singleTrigger: KpSelectMenuTriggerComponent;
  @ViewChild('multiTrigger') multiTrigger: KpSelectMenuTriggerComponent;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  @ViewChild('multiSelect') multiSelect: MatSelect;
  singleControl = new FormControl('');
  multiControl = new FormControl(['']);
}
