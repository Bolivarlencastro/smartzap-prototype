import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpGlobalSearchItemComponent } from './kp-global-search-item.component';

describe('KpGlobalSearchItemComponent', () => {
  let component: KpGlobalSearchItemComponent;
  let fixture: ComponentFixture<KpGlobalSearchItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [getTranslocoTestingModule(), KpGlobalSearchItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpGlobalSearchItemComponent);
    component = fixture.componentInstance;
    component.item = {};
    fixture.detectChanges();
  });

  it('should emit openDetails event', () => {
    const spy = jest.spyOn(component.openDetails, 'emit');
    component.onOpenDetails();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit openContent event', () => {
    const emitSpy = jest.spyOn(component.openContent, 'emit');
    const event = { stopPropagation: jest.fn() } as unknown as Event;

    component.onOpenContent(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });
});
