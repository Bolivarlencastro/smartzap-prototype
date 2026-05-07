import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { CustomSectionsHeaderComponent } from './custom-sections-header.component';

describe('CustomSectionsHeaderComponent', () => {
  let component: CustomSectionsHeaderComponent;
  let fixture: ComponentFixture<CustomSectionsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomSectionsHeaderComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomSectionsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit changePage event', () => {
    const emitSpy = jest.spyOn(component.changePage, 'emit');
    component.onChangePage('highlights');
    expect(emitSpy).toHaveBeenCalledWith('highlights');
  });

  it('should emit createSection event', () => {
    const emitSpy = jest.spyOn(component.createSection, 'emit');
    component.onCreateSection('HIGHLIGHT.LEARNING_TRAIL');
    expect(emitSpy).toHaveBeenCalledWith('HIGHLIGHT.LEARNING_TRAIL');
  });
});
