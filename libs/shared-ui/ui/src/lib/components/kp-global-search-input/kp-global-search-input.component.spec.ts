import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpGlobalSearchInputComponent } from './kp-global-search-input.component';

describe('KpGlobalSearchInputComponent', () => {
  let component: KpGlobalSearchInputComponent;
  let fixture: ComponentFixture<KpGlobalSearchInputComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpGlobalSearchInputComponent, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpGlobalSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the filterEvent when the input value changes', async () => {
    const filterEventSpy = jest.spyOn(component.filterEvent, 'emit');
    const term = 'testValue';
    inputElement = fixture.debugElement.query(By.css('#filter-input')).nativeElement;
    inputElement.value = term;
    inputElement.dispatchEvent(new Event('input'));

    await fixture.whenStable();
    expect(filterEventSpy).toHaveBeenCalledWith(term);
  });
});
