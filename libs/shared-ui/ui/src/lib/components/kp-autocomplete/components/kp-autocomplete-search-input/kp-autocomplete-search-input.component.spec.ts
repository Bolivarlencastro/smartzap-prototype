import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpAutocompleteSearchInputComponent } from './kp-autocomplete-search-input.component';

describe('KpAutocompleteSearchInputComponent', () => {
  let component: KpAutocompleteSearchInputComponent;
  let fixture: ComponentFixture<KpAutocompleteSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpAutocompleteSearchInputComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpAutocompleteSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the filterEvent when the input value changes', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component.searchFormControl.setValue('mock_search');
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith('mock_search');
  }));

  it('should cancel click events from the host component', () => {
    const event = { stopPropagation: jest.fn() } as unknown as jest.Mocked<MouseEvent>;

    component.hostClick(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
