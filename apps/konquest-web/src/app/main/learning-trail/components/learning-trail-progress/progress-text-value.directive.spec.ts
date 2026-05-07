import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProgressTextValueDirective } from './progress-text-value.directive';

describe('ProgressTextValueDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elements: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    elements = fixture.debugElement.queryAll(By.directive(ProgressTextValueDirective));
  });

  it('should have 5 elements', () => {
    expect(elements.length).toBe(5);
  });

  it('should render the percentage correctly', () => {
    expect(elements[0].nativeElement.innerText).toBe('0%');
    expect(elements[1].nativeElement.innerText).toBe('0%');
    expect(elements[2].nativeElement.innerText).toBe('3%');
    expect(elements[3].nativeElement.innerText).toBe('5%');
    expect(elements[4].nativeElement.innerText).toBe('20%');
  });

  it('should calculate the left position correctly', () => {
    expect(elements[0].nativeElement.style.left).toBe('calc(0% + 5px)');
    expect(elements[1].nativeElement.style.left).toBe('calc(0% + 5px)');
    expect(elements[2].nativeElement.style.left).toBe('calc(3% + 5px)');
    expect(elements[3].nativeElement.style.left).toBe('calc(5% - 25px)');
    expect(elements[4].nativeElement.style.left).toBe('calc(20% - 35px)');
  });
});

@Component({
  template: `
    <small appProgressTextValue></small>
    <small [appProgressTextValue]="0"></small>
    <small [appProgressTextValue]="0.03"></small>
    <small [appProgressTextValue]="'0.05'"></small>
    <small [appProgressTextValue]="'0.2'"></small>
  `,
  imports: [ProgressTextValueDirective],
})
class TestComponent {}
