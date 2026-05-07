import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContentTab } from '../../models/section-contents';
import { SectionContentsActions } from '../../store/actions';
import { sectionContentsInitialState } from '../../store/features/section-contents.feature';
import { MenuContentsComponent } from './menu-contents.component';

describe('MenuContentsComponent', () => {
  let component: MenuContentsComponent;
  let fixture: ComponentFixture<MenuContentsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuContentsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: sectionContentsInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(MenuContentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('section', { id: '123', learning_object_type: 'HIGHLIGHT.COURSE' });

    fixture.detectChanges();
  });

  it('should dispatch init action', () => {
    component.onOpenContentMenu();
    expect(store.dispatch).toHaveBeenCalledWith(
      SectionContentsActions.init({ learningObjectType: 'HIGHLIGHT.COURSE' }),
    );
  });

  it('should dispatch setSearch action', () => {
    const search = 'test';
    component.onSearchContent(search);
    expect(store.dispatch).toHaveBeenCalledWith(SectionContentsActions.setSearch({ search }));
  });

  it('should dispatch setTab action', () => {
    const tab: ContentTab = { label: 'CUSTOM_SECTIONS.CONTENT_TABS.CATEGORIES', value: 'category' };
    component.onChangeContentTab(tab);
    expect(store.dispatch).toHaveBeenCalledWith(SectionContentsActions.setTab({ tab: tab.value }));
  });

  it('should dispatch save action', () => {
    component.onSave();
    expect(store.dispatch).toHaveBeenCalledWith(
      SectionContentsActions.save({ section: { id: '123', learning_object_type: 'HIGHLIGHT.COURSE' }, ids: [] }),
    );
  });

  it('should dispatch reset action', () => {
    component.onResetState();
    expect(store.dispatch).toHaveBeenCalledWith(SectionContentsActions.reset());
  });
});
