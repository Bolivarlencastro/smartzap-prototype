import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { CustomSectionModel, DeleteContentModel } from '../../models/custom-sections';
import { CustomSectionsListComponent } from './custom-sections-list.component';

describe('CustomSectionsListComponent', () => {
  let component: CustomSectionsListComponent;
  let fixture: ComponentFixture<CustomSectionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomSectionsListComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomSectionsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit createSection event', () => {
    const emitSpy = jest.spyOn(component.createSection, 'emit');
    component.onCreateSection('HIGHLIGHT.LEARNING_TRAIL');
    expect(emitSpy).toHaveBeenCalledWith('HIGHLIGHT.LEARNING_TRAIL');
  });

  it('should emit deleteSection event', () => {
    const emitSpy = jest.spyOn(component.deleteSection, 'emit');
    component.onDeleteSection('123');
    expect(emitSpy).toHaveBeenCalledWith('123');
  });

  it('should emit editSection event', () => {
    const emitSpy = jest.spyOn(component.editSection, 'emit');
    const section: CustomSectionModel = { id: '123', title: 'New Name', description: null };

    component.onEditSection(section);

    expect(emitSpy).toHaveBeenCalledWith(section);
  });

  it('should emit deleteContent event', () => {
    const emitSpy = jest.spyOn(component.deleteContent, 'emit');
    const data: DeleteContentModel = {
      section: { id: '123', learning_object_type: 'HIGHLIGHT.COURSE' },
      content: { filter_key: 'ID', id: '555', name: 'Anything', icon: 'route' },
    };

    component.onDeleteContent(data);

    expect(emitSpy).toHaveBeenCalledWith(data);
  });
});
