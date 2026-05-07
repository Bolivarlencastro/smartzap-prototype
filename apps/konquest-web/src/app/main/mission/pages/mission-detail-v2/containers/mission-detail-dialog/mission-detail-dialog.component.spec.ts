import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MissionAction } from '../../builders';
import {
  MissionDetailActions,
  missionDetailDialogFeatureInitialState,
  missionDetailDialogFeatureKey,
  MissionOptionsMenuActions,
} from '../../store';
import { MissionDetailDialogComponent } from './mission-detail-dialog.component';

describe('MissionDetailDialogComponent', () => {
  let component: MissionDetailDialogComponent;
  let fixture: ComponentFixture<MissionDetailDialogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionDetailDialogComponent],
      providers: [
        provideMockStore({ initialState: { [missionDetailDialogFeatureKey]: missionDetailDialogFeatureInitialState } }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(MissionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch action to close dialog', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.closeDialog();

    expect(spy).toHaveBeenCalledWith(MissionDetailActions.closeMissionDetails());
  });

  it('should dispatch action to update mission summary', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const summary = 'test';
    component.updateMissionSummary(summary);

    expect(spy).toHaveBeenCalledWith(MissionDetailActions.updateMissionSummary({ summary }));
  });

  it('should dispatch action to add tag', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const tags = ['test tag 1', 'test tag 2'];
    component.onAddTag(tags);

    expect(spy).toHaveBeenCalledWith(MissionDetailActions.createTags({ tags }));
  });

  it('should dispatch action to remove tag', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const tag = { id: '1' };
    component.onRemoveTag(tag);

    expect(spy).toHaveBeenCalledWith(MissionDetailActions.removeTag({ tagId: tag.id }));
  });

  it('should dispatch action to execute action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const action: MissionAction = { id: 'open-mission', label: 'test' };
    component.executeAction(action);

    expect(spy).toHaveBeenCalledWith(MissionOptionsMenuActions.executeAction({ action }));
  });
});
