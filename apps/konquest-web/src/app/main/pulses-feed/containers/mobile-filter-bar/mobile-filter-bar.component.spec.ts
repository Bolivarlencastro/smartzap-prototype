jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MobileFilterBarComponent } from './mobile-filter-bar.component';
import { FeedActions, feedFeature } from '../../store';
import { SideFiltersViewModel } from '../../models/view-models';

const mockVm: SideFiltersViewModel = {
  loading: false,
  selectedTab: 'feed',
  generalOptions: [
    { id: 'favorites', name: 'Favorites' },
    { id: 'created_by_me', name: 'Created by me' },
  ],
  languageOptions: [
    { id: 'pt-BR', name: 'Portuguese (BR)' },
    { id: 'en', name: 'English' },
  ],
  typeOptions: [
    { id: 'video', name: 'Video' },
    { id: 'pdf', name: 'PDF' },
  ],
  categoryOptions: [
    { id: 'cat-1', name: 'Category 1' },
    { id: 'cat-2', name: 'Category 2' },
  ],
  selectedGeneral: null,
  selectedLanguages: [],
  selectedTypes: [],
  selectedCategories: [],
};

describe('MobileFilterBarComponent', () => {
  let component: MobileFilterBarComponent;
  let fixture: ComponentFixture<MobileFilterBarComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFilterBarComponent, getTranslocoTestingModule()],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(feedFeature.selectSideFiltersViewModel, mockVm);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('generalIcon', () => {
    it('should return "bookmark" for id "favorites"', () => {
      expect(component.generalIcon('favorites')).toBe('bookmark');
    });

    it('should return "edit" for id "created_by_me"', () => {
      expect(component.generalIcon('created_by_me')).toBe('edit');
    });

    it('should return "subscriptions" for any other id', () => {
      expect(component.generalIcon('subscribed')).toBe('subscriptions');
      expect(component.generalIcon('unknown')).toBe('subscriptions');
    });
  });

  describe('onToggleGeneral', () => {
    it('should dispatch setSideFilters with opt.id when the option is not currently selected', () => {
      component.onToggleGeneral({ id: 'favorites', name: 'Favorites' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ general: 'favorites' }));
    });

    it('should dispatch setSideFilters with null when the option is already selected (toggle off)', () => {
      store.overrideSelector(feedFeature.selectSideFiltersViewModel, { ...mockVm, selectedGeneral: 'favorites' });
      store.refreshState();
      fixture.detectChanges();

      component.onToggleGeneral({ id: 'favorites', name: 'Favorites' });
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setSideFilters({ general: null }));
    });
  });

  describe('form valueChanges', () => {
    it('should dispatch setSideFilters with the updated form values when form changes', () => {
      (store.dispatch as jest.Mock).mockClear();

      component.form.setValue({
        languages: ['pt-BR'],
        types: ['video'],
        categories: ['cat-1'],
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        FeedActions.setSideFilters({ languages: ['pt-BR'], types: ['video'], categories: ['cat-1'] }),
      );
    });
  });

  describe('init effect — vm sync', () => {
    it('should patch the form with vm selected values when vm emits', () => {
      store.overrideSelector(feedFeature.selectSideFiltersViewModel, {
        ...mockVm,
        selectedLanguages: ['en'],
        selectedTypes: ['pdf'],
        selectedCategories: ['cat-2'],
      });
      store.refreshState();
      fixture.detectChanges();

      expect(component.form.value).toEqual({
        languages: ['en'],
        types: ['pdf'],
        categories: ['cat-2'],
      });
    });

    it('should not dispatch a store action when syncing the form from vm', () => {
      (store.dispatch as jest.Mock).mockClear();

      store.overrideSelector(feedFeature.selectSideFiltersViewModel, {
        ...mockVm,
        selectedLanguages: ['pt-BR'],
      });
      store.refreshState();
      fixture.detectChanges();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
