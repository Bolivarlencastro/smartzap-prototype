import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromActions from '../../store/category.actions';
import { initialState } from '../../store/category.reducer';
import { CategoriesListComponent } from './categories-list.component';

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoriesListComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: { categoryCache: initialState },
        }),
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should dispatch loadCategories action on init', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(fromActions.loadCategories());
  });

  it('should dispatch clearCache action on destroy', () => {
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(fromActions.clearCache());
  });
});
