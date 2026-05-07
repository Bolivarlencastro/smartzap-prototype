import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CycleCreateActions } from '../../store';
import { cycleCreateInitialState } from '../../store/features';
import { CycleCreateComponent } from './cycle-create.component';
import { CycleCreateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CycleCreateFormComponent } from '../../components';

describe('CycleDialogComponent', () => {
  let component: CycleCreateComponent;
  let fixture: ComponentFixture<CycleCreateComponent>;
  let store: MockStore;

  beforeEach(async () => {
    TestBed.overrideComponent(CycleCreateComponent, {
      remove: { imports: [CycleCreateFormComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [CycleCreateComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['normativeCycle']: cycleCreateInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CycleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch submit cycle', () => {
    const mockFormValue = { complianceId: 'mock_compliance_id' } as CycleCreateDto;

    component.onSubmit(mockFormValue);

    expect(store.dispatch).toHaveBeenCalledWith(CycleCreateActions.saveNormativeCycle({ cycle: mockFormValue }));
  });

  it('should dispatch delete cycle', () => {
    const mockId = 'mock_cycle_id';

    component.onDelete(mockId);

    expect(store.dispatch).toHaveBeenCalledWith(CycleCreateActions.deleteNormativeCycles({ ids: [mockId] }));
  });
});
