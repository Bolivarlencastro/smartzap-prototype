import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ImportListActions } from '../../store/actions';
import { importListFeature } from '../../store/features';
import { ImportListDialogComponent } from './import-list-dialog.component';

describe('ImportListDialogComponent', () => {
  let component: ImportListDialogComponent;
  let fixture: ComponentFixture<ImportListDialogComponent>;
  let store: MockStore;
  let matDialogRefMock: jest.Mocked<MatDialogRef<ImportListDialogComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportListDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: importListFeature }),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    matDialogRefMock = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<ImportListDialogComponent>>;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ImportListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch reset action on destroy', () => {
    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(ImportListActions.reset());
  });

  it('should dispatch selectFileOnInit action', () => {
    const [selectedDateId, file] = ['123', new File(['content'], 'test.csv', { type: 'text/csv' })];

    component.onFileChangeOnInit({ selectedDateId, file });

    expect(store.dispatch).toHaveBeenCalledWith(ImportListActions.selectFileOnInit({ selectedDateId, file }));
  });

  it('should dispatch checkImportFile action', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });

    component.onFileChangeOnError(file);

    expect(store.dispatch).toHaveBeenCalledWith(ImportListActions.checkImportFile({ file }));
  });

  it('should dispatch continueImport action', () => {
    component.onContinue();

    expect(store.dispatch).toHaveBeenCalledWith(ImportListActions.continueImport());
  });

  it('should dispatch confirmImport action', () => {
    const closeSpy = jest.spyOn(matDialogRefMock, 'close');

    component.onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(ImportListActions.confirmImport());
    expect(closeSpy).toHaveBeenCalled();
  });
});
