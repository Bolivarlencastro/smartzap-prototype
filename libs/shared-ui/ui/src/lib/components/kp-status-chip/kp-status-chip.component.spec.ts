import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KpStatusChipComponent } from './kp-status-chip.component';

describe('KpStatusChipComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, KpStatusChipComponent],
      declarations: [TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const color = fixture.debugElement.query(By.css('.status-box')).nativeElement as HTMLElement;

    expect(color.style.backgroundColor).toBe('green');
  });

  it('should accept any color', () => {
    const expectedColor = 'rgb(112, 204, 171)';
    component.color = expectedColor;
    fixture.detectChanges();

    const color = fixture.debugElement.query(By.css('.status-box')).nativeElement as HTMLElement;

    expect(color.style.backgroundColor).toBe(expectedColor);
  });
});

@Component({
  template: `<kp-status-chip [color]="color"> </kp-status-chip>`,
  standalone: false,
})
class TestHostComponent {
  color = 'green';
}
