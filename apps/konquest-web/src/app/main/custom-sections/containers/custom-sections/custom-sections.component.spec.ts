import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomSectionsListComponent } from '../../components/custom-sections-list/custom-sections-list.component';
import { CustomSectionsActions } from '../../store/actions';
import { customSectionsInitialState } from '../../store/features';
import { CustomSectionsComponent } from './custom-sections.component';

describe('CustomSectionsComponent', () => {
  let component: CustomSectionsComponent;
  let fixture: ComponentFixture<CustomSectionsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSectionsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: customSectionsInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(CustomSectionsComponent, {
      remove: { imports: [CustomSectionsListComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CustomSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch reset action on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.reset());
  });

  it('should dispatch changePage action', () => {
    const pageType = 'learning-trails';
    component.onChangePage(pageType);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.changePage({ pageType }));
  });

  it('should dispatch openSectionCreationDialog action', () => {
    const id = 'HIGHLIGHT.EVENTS.ENROLLED';
    component.onCreateSection(id);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.openSectionCreationDialog({ id }));
  });

  it('should dispatch deleteSection action', () => {
    const id = '123';
    component.onDeleteSection(id);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.openDeleteSectionDialog({ id }));
  });

  it('should dispatch openSectionEditionDialog action', () => {
    const data = { id: '123', name: 'Anything' };
    component.onEditSection(data);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.openSectionEditionDialog({ data }));
  });

  it('should dispatch deleteContent action', () => {
    const data = {
      section: { id: '123', name: 'Anything' },
      content: { filter_key: 'ID', id: '111', name: 'Content 1', icon: 'route' },
    };
    component.onDeleteContent(data);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.deleteContent({ data }));
  });

  it('should dispatch reorderSections action', () => {
    const ids = ['123', '456'];
    component.onReorderSections(ids);
    expect(store.dispatch).toHaveBeenCalledWith(CustomSectionsActions.reorderSections({ ids }));
  });
});
