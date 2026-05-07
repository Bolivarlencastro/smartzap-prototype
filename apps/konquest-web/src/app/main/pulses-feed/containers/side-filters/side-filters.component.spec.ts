jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Signal } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { SideFiltersComponent } from './side-filters.component';
import { FeedActions, feedFeature } from '../../store';
import { SideFilterOption, SideFiltersViewModel } from '../../models/view-models';

type SideFiltersProtected = {
  visibleCategories: Signal<SideFilterOption[]>;
  isSelected: (selected: string[] | undefined, id: string) => boolean;
};

const mockVm: SideFiltersViewModel = {
  loading: false,
  selectedTab: 'feed',
  generalOptions: [
    { id: 'favorites', name: 'Favorites' },
    { id: 'created_by_me', name: 'Created by me' },
    { id: 'subscribed', name: 'Subscribed' },
  ],
  languageOptions: [
    { id: 'pt-BR', name: 'Portuguese (BR)' },
    { id: 'en', name: 'English' },
  ],
  typeOptions: [
    { id: 'video', name: 'Video' },
    { id: 'pdf', name: 'PDF' },
  ],
  categoryOptions: Array.from({ length: 12 }, (_, i) => ({ id: `cat-${i}`, name: `Category ${i}` })),
  selectedGeneral: null,
  selectedLanguages: [],
  selectedTypes: [],
  selectedCategories: [],
};

describe('SideFiltersComponent', () => {
  let component: SideFiltersComponent;
  let fixture: ComponentFixture<SideFiltersComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideFiltersComponent, getTranslocoTestingModule()],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(feedFeature.selectSideFiltersViewModel, mockVm);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('visibleCategories', () => {
    it('should show max 10 categories by default', () => {
      expect((fixture.componentInstance as unknown as SideFiltersProtected).visibleCategories().length).toBe(10);
    });

    it('should show all categories after toggleShowAllCategories', () => {
      component.toggleShowAllCategories();
      expect((fixture.componentInstance as unknown as SideFiltersProtected).visibleCategories().length).toBe(12);
    });

    it('should return to max 10 when toggled back', () => {
      component.toggleShowAllCategories();
      component.toggleShowAllCategories();
      expect((fixture.componentInstance as unknown as SideFiltersProtected).visibleCategories().length).toBe(10);
    });
  });

  describe('isSelected', () => {
    it('should return true when id is in the selected list', () => {
      expect((fixture.componentInstance as unknown as SideFiltersProtected).isSelected(['pt-BR', 'en'], 'pt-BR')).toBe(
        true,
      );
    });

    it('should return false when id is not in the selected list', () => {
      expect((fixture.componentInstance as unknown as SideFiltersProtected).isSelected(['pt-BR'], 'en')).toBe(false);
    });

    it('should return false when selected list is undefined', () => {
      expect((fixture.componentInstance as unknown as SideFiltersProtected).isSelected(undefined, 'pt-BR')).toBe(false);
    });
  });

  describe('onToggleGeneral', () => {
    it('should dispatch setSideFilters selecting a new general filter', () => {
      component.onToggleGeneral({ id: 'favorites', name: 'Favorites' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ general: 'favorites' }));
    });
  });

  describe('onToggleLanguage', () => {
    it('should add a language when not already selected', () => {
      component.onToggleLanguage({ id: 'pt-BR', name: 'Portuguese (BR)' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ languages: ['pt-BR'] }));
    });
  });

  describe('onToggleType', () => {
    it('should add a type when not already selected', () => {
      component.onToggleType({ id: 'video', name: 'Video' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ types: ['video'] }));
    });
  });

  describe('onToggleCategory', () => {
    it('should add a category when not already selected', () => {
      component.onToggleCategory({ id: 'cat-0', name: 'Category 0' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ categories: ['cat-0'] }));
    });
  });

  describe('onClearAll', () => {
    it('should dispatch clearSideFilters', () => {
      component.onClearAll();
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.clearSideFilters());
    });
  });
});
