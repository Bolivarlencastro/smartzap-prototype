import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { UserDataTransferActions } from '../../store/actions';
import { userDataTransferInitialState } from '../../store/features';
import { UserDataTransferComponent } from './user-data-transfer.component';

describe('UserDataTransferComponent', () => {
  let component: UserDataTransferComponent;
  let fixture: ComponentFixture<UserDataTransferComponent>;
  let matDialogRef: MatDialogRef<UserDataTransferComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataTransferComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { id: '111' } },
        provideMockStore({ initialState: userDataTransferInitialState }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<UserDataTransferComponent>>;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserDataTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch resetState event on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(UserDataTransferActions.resetState());
  });

  it('should close dialog when click on import button', () => {
    const closeSpy = jest.spyOn(matDialogRef, 'close');
    component['sourceUserControl'].setValue({ value: '222', label: 'test', avatar: '' });
    fixture.detectChanges();

    component.transferData();
    expect(closeSpy).toHaveBeenCalledWith({
      source_user_id: '222',
      target_user_id: '111',
    });
  });
});
