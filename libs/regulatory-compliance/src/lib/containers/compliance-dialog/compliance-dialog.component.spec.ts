import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceDialogComponent } from './compliance-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { complianceDialogFeature, complianceDialogInitialState } from '../../store/features';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComplianceDialogActions } from '../../store/actions';
import { ComplianceListItem } from '../../models';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('ComplianceDialogComponent', () => {
  let component: ComplianceDialogComponent;
  let fixture: ComponentFixture<ComplianceDialogComponent>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceDialogComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [complianceDialogFeature.name]: complianceDialogInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it(`should emit ${ComplianceDialogActions.filterCompliance.type}`, () => {
    component.onFilter('filter');

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.filterCompliance({ filter: 'filter' }));
  });

  it(`should emit ${ComplianceDialogActions.toggleSelectCompliance.type}`, () => {
    component.onToggleSelection({ id: 'mock_id', selected: true });

    expect(dispatchSpy).toHaveBeenCalledWith(
      ComplianceDialogActions.toggleSelectCompliance({ id: 'mock_id', selected: true }),
    );
  });

  it(`should emit ${ComplianceDialogActions.toggleSelectAllCompliance.type}`, () => {
    component.onToggleSelectAll(true);

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.toggleSelectAllCompliance({ selected: true }));
  });

  it(`should emit ${ComplianceDialogActions.editCompliance.type}`, () => {
    const mockCompliance: ComplianceListItem = { id: 'mock_id', name: 'test', selected: false };

    component.onEditCompliance(mockCompliance);

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.saveCompliance({ compliance: mockCompliance }));
  });

  it(`should emit ${ComplianceDialogActions.saveCompliance.type}`, () => {
    component.onSaveCompliance('mock_name');

    expect(dispatchSpy).toHaveBeenCalledWith(
      ComplianceDialogActions.saveCompliance({ compliance: { name: 'mock_name' } }),
    );
  });

  it(`should emit ${ComplianceDialogActions.deleteCompliance.type}`, () => {
    component.onDeleteCompliance('mock_id');

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.deleteCompliance({ id: 'mock_id' }));
  });

  it(`should emit ${ComplianceDialogActions.batchDeleteCompliance.type}`, () => {
    component.onBatchDelete();

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.batchDeleteCompliance());
  });

  it(`should emit ${ComplianceDialogActions.loadMoreItems.type}`, () => {
    component.onLoadMoreItems();

    expect(dispatchSpy).toHaveBeenCalledWith(ComplianceDialogActions.loadMoreItems());
  });
});
