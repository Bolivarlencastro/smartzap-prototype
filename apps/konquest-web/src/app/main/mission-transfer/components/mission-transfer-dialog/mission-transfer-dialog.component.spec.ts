import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceWithUserRoles } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MissionTransferDestinationType } from 'app/main/mission-transfer/models';
import { MissionTransferActions, MissionTransferReducer } from '../../store';
import { MissionTransferDialogComponent } from './mission-transfer-dialog.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionTransferDialogComponent', () => {
  let component: MissionTransferDialogComponent;
  let fixture: ComponentFixture<MissionTransferDialogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionTransferDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: {
            [MissionTransferReducer.missionTransferFeatureKey]: MissionTransferReducer.missionTransferInitialState,
          },
        }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`it should dispatch ${MissionTransferActions.filterRecipients.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const searchTerm = 'filter_test';

    component.filterChange(searchTerm);

    expect(dispatchSpy).toHaveBeenCalledWith(MissionTransferActions.filterRecipients({ search: searchTerm }));
  });

  it(`it should dispatch ${MissionTransferActions.positiveButtonClick.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.actionButtonClick(true);

    expect(dispatchSpy).toHaveBeenCalledWith(MissionTransferActions.positiveButtonClick());
  });

  it(`it should dispatch ${MissionTransferActions.negativeButtonClick.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.actionButtonClick(false);

    expect(dispatchSpy).toHaveBeenCalledWith(MissionTransferActions.negativeButtonClick());
  });

  it(`it should dispatch ${MissionTransferActions.removeRecipient.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.clearRecipient();

    expect(dispatchSpy).toHaveBeenCalledWith(MissionTransferActions.removeRecipient());
  });

  it(`it should dispatch ${MissionTransferActions.resetState.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(MissionTransferActions.resetState());
  });

  describe('destinationTypeChanged', () => {
    it(`it should dispatch ${MissionTransferActions.setTransferDestinationType.type} action`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const expectedDestinationType = MissionTransferDestinationType.OTHER_WORKSPACE;

      component.destinationTypeChange(MissionTransferDestinationType.OTHER_WORKSPACE);

      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionTransferActions.setTransferDestinationType({ transferDestinationType: expectedDestinationType }),
      );
    });

    it(`it should reset the recipient formControl value`, () => {
      const resetSpy = jest.spyOn(component.recipientFormControl, 'reset');

      component.destinationTypeChange(MissionTransferDestinationType.OTHER_WORKSPACE);

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('selectedWorkspaceChange', () => {
    it(`it should dispatch ${MissionTransferActions.setSelectedWorkspace.type} action`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const expectedWorkspace: WorkspaceWithUserRoles = { id: '123', name: 'test' };

      component.selectedWorkspaceChange(expectedWorkspace);

      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionTransferActions.setSelectedWorkspace({ workspace: expectedWorkspace }),
      );
    });

    it(`it should reset the recipient formControl value`, () => {
      const resetSpy = jest.spyOn(component.recipientFormControl, 'reset');

      component.selectedWorkspaceChange(null);

      expect(resetSpy).toHaveBeenCalled();
    });
  });
});
