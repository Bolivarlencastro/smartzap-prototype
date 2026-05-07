import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LinkCycleDialogComponent } from './link-cycle-dialog.component';
import { LinkCycleActions, linkCycleInitialState } from './store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('LinkCycleDialogComponent', () => {
  let component: LinkCycleDialogComponent;
  let fixture: ComponentFixture<LinkCycleDialogComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkCycleDialogComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState: { ['linkCycle']: linkCycleInitialState } }),
        provideNoopAnimations(),
      ],
    });

    fixture = TestBed.createComponent(LinkCycleDialogComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit cycle to link', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onSubmit('mock_id');

    expect(spy).toHaveBeenCalledWith(LinkCycleActions.linkCycle({ cycleId: 'mock_id' }));
  });

  it('should emit filterCycle action', () => {
    const spy = jest.spyOn(store, 'dispatch');

    component.filterCycle('mock_cycle');

    expect(spy).toHaveBeenCalledWith(LinkCycleActions.filterCycles({ filter: 'mock_cycle' }));
  });
});
