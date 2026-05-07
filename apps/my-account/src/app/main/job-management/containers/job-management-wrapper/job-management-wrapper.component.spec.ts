import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { JobEnum } from '../../models';
import { JobManagementActions, jobManagementInitialState } from '../../store';
import { JobManagementWrapperComponent } from './job-management-wrapper.component';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';

describe('JobManagementWrapperComponent', () => {
  let component: JobManagementWrapperComponent;
  let fixture: ComponentFixture<JobManagementWrapperComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobManagementWrapperComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['jobManagement']: jobManagementInitialState } })],
    });
    fixture = TestBed.createComponent(JobManagementWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change tab when tab is not active', () => {
    component.activeTab = JobEnum.JOB_FUNCTION;
    const newTab = JobEnum.JOB_POSITION;
    component.changeTab(newTab);
    expect(dispatchSpy).toHaveBeenCalledWith(JobManagementActions.changeTab({ tab: newTab }));
  });

  it('should not change tab when tab is active', () => {
    const tab = JobEnum.JOB_POSITION;
    component.activeTab = tab;
    component.changeTab(tab);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should update search term', () => {
    const searchTerm = 'test';
    component.updateSearchTerm(searchTerm);
    expect(dispatchSpy).toHaveBeenCalledWith(JobManagementActions.updateSearchTerm({ searchTerm }));
  });

  it('should open dialog', () => {
    component.openDialog();
    expect(dispatchSpy).toHaveBeenCalledWith(JobManagementActions.openDialog({}));
  });

  it('should delete items', () => {
    const id = ['1', '2', '3'];
    component.onDelete(id);
    expect(dispatchSpy).toHaveBeenCalledWith(JobManagementActions.deleteItem({ id }));
  });
});
