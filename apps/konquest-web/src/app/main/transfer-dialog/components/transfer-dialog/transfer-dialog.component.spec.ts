import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDialogComponent } from './transfer-dialog.component';
import { TransferDialogActions } from '../../store/actions';
import { initialState, transferDialogFeatureKey } from '../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TransferDialogService } from '../../services/transfer-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransferContentType, TransferDialogData } from '../../models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const MOCK_DIALOG_DATA: TransferDialogData = {
  contentType: TransferContentType.CHANNEL,
  transferContent: { id: '123456', name: 'mock_content' },
};

describe('TransferDialogComponent', () => {
  let component: TransferDialogComponent;
  let fixture: ComponentFixture<TransferDialogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferDialogComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: TransferDialogService,
          useValue: { registerDialogRef: jest.fn() },
        },
        { provide: MAT_DIALOG_DATA, useValue: MOCK_DIALOG_DATA },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        provideMockStore({ initialState: { [transferDialogFeatureKey]: initialState } }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`it should dispatch ${TransferDialogActions.filterRecipients.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const searchTerm = 'filter_test';

    component.filterChange(searchTerm);

    expect(dispatchSpy).toHaveBeenCalledWith(TransferDialogActions.filterRecipients({ searchTerm }));
  });

  it(`it should dispatch ${TransferDialogActions.positiveButtonClick.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.actionButtonClick(true);

    expect(dispatchSpy).toHaveBeenCalledWith(TransferDialogActions.positiveButtonClick());
  });

  it(`it should dispatch ${TransferDialogActions.negativeButtonClick.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.actionButtonClick(false);

    expect(dispatchSpy).toHaveBeenCalledWith(TransferDialogActions.negativeButtonClick());
  });

  it(`it should dispatch ${TransferDialogActions.removeRecipient.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.clearRecipient();

    expect(dispatchSpy).toHaveBeenCalledWith(TransferDialogActions.removeRecipient());
  });

  it(`it should dispatch ${TransferDialogActions.resetState.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(TransferDialogActions.resetState());
  });
});
