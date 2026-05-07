import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MenuContentsComponent } from '../../containers/menu-contents/menu-contents.component';
import { SectionComponent } from './section.component';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SectionComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    TestBed.overrideComponent(SectionComponent, {
      remove: { imports: [MenuContentsComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('section', { id: '123', learning_object_type: 'HIGHLIGHT.COURSE' });

    fixture.detectChanges();
  });

  it('should emit deleteSection event', () => {
    const emitSpy = jest.spyOn(component.deleteSection, 'emit');
    component.onDeleteSection();
    expect(emitSpy).toHaveBeenCalledWith('123');
  });

  it('should emit editSection event', () => {
    const emitSpy = jest.spyOn(component.editSection, 'emit');
    component.onEditSection();
    expect(emitSpy).toHaveBeenCalledWith({ id: '123', learning_object_type: 'HIGHLIGHT.COURSE' });
  });

  it('should emit deleteContent event', () => {
    const emitSpy = jest.spyOn(component.deleteContent, 'emit');
    const content = { filter_key: 'ID', id: '555', name: 'Anything', icon: 'route' };

    component.onDeleteContent(content);

    expect(emitSpy).toHaveBeenCalledWith({ section: { id: '123', learning_object_type: 'HIGHLIGHT.COURSE' }, content });
  });
});
