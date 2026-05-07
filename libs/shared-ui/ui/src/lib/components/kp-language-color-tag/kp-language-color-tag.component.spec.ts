import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpLanguageColorTagComponent } from './kp-language-color-tag.component';
import { Component } from '@angular/core';
import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpLanguageColorTagComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [KpLanguageColorTagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should have the correct height', () => {
    const heightClass = 'h-5';
    const classList = fixture.nativeElement.querySelector(
      '[data-test="kp-language-color-tag.flag_color_tag"]',
    ).classList;
    expect(classList).toContain(heightClass);
  });

  it('should have the correct width', () => {
    const widthClass = 'w-3';
    const classList = fixture.nativeElement.querySelector(
      '[data-test="kp-language-color-tag.flag_color_tag"]',
    ).classList;
    expect(classList).toContain(widthClass);
  });
});

@Component({
  template: ` <kp-language-color-tag [language]="language"></kp-language-color-tag>`,
  standalone: false,
})
class TestHostComponent {
  language: LanguageTypes = 'pt-BR';
}
