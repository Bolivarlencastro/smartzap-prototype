import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { LedOverviewComponent } from './led-overview.component';
import { LedOverviewTabComponent } from './led-overview-tab.component';
import { LedOverviewActions, ledOverviewInitialState } from '../../store/led-overview';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

describe('LedOverviewComponent', () => {
  let component: LedOverviewComponent;
  let fixture: ComponentFixture<LedOverviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedOverviewComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: ledOverviewInitialState }),
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(LedOverviewComponent, {
      remove: { imports: [LedOverviewTabComponent] },
      add: { schemas: [NO_ERRORS_SCHEMA] },
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(LedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch reset action on destroy', () => {
    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(LedOverviewActions.resetState());
  });
});
