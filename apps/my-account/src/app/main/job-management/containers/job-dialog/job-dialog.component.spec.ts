import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { JobModel } from '../../models';
import { JobManagementActions, jobManagementInitialState } from '../../store';
import { JobDialogComponent } from './job-dialog.component';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';

describe('JobDialogComponent', () => {
  let component: JobDialogComponent;
  let fixture: ComponentFixture<JobDialogComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobDialogComponent, NoopAnimationsModule, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['jobManagement']: jobManagementInitialState } })],
    });
    fixture = TestBed.createComponent(JobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit item', () => {
    const item: JobModel = { id: '1', name: 'Job 1' };
    component.onSubmit(item);
    expect(dispatchSpy).toHaveBeenCalledWith(JobManagementActions.saveItem({ response: item }));
  });
});
