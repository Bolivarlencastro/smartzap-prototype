import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as fromActions from '../../store/group-channel.actions';
import { groupChannelsFeatureKey, initialState } from '../../store/group-channel.reducer';
import { GroupChannelsPageComponent } from './group-channels-page.component';

@Component({
  selector: 'app-host-component',
  template: '<div id="container-3"><app-group-channels-page></app-group-channels-page></div>',
  imports: [GroupChannelsPageComponent],
})
class TestHostComponent {
  @ViewChild(GroupChannelsPageComponent)
  groupChannelsPageComponent!: GroupChannelsPageComponent;
}

describe('GroupChannelsPageComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: GroupChannelsPageComponent;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: MatDialogRef, useValue: {} },
        provideMockStore({ initialState: { [groupChannelsFeatureKey]: initialState } }),
        {
          provide: ActivatedRoute,
          useValue: { parent: { parent: { params: of({ id: 'mock_id' }) } } },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    component = hostComponent.groupChannelsPageComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch filterGroupChannels with route group id', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.filterGroupChannels({ id: 'mock_id', queryParams: { page: 1, per_page: 10 } }),
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch clearCache', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.clearCache());
    });
  });

  describe('applyFilter', () => {
    it('should dispatch filterGroupChannels with the search term', () => {
      component.applyFilter('my search');

      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.filterGroupChannels({
          id: 'mock_id',
          queryParams: { page: 1, per_page: component.perPage(), search: 'my search', ordering: null },
        }),
      );
    });

    it('should update the term property', () => {
      component.applyFilter('angular');
      expect(component.term).toBe('angular');
    });
  });

  describe('onSort', () => {
    it('should dispatch filterGroupChannels with the ordering value', () => {
      component.onSort({ ordering: '-name' });

      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.filterGroupChannels({
          id: 'mock_id',
          queryParams: { page: 1, per_page: component.perPage(), search: component.term, ordering: '-name' },
        }),
      );
    });

    it('should set ordering to null when event has no ordering', () => {
      component.onSort({});
      expect(component.ordering).toBeNull();
    });
  });

  describe('onPageChange', () => {
    it('should dispatch filterGroupChannels with page = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.filterGroupChannels({
          id: 'mock_id',
          queryParams: { page: 3, per_page: 25, search: component.term, ordering: component.ordering },
        }),
      );
    });
  });

  describe('onRemove', () => {
    it('should dispatch deleteGroupChannel after dialog confirmation', () => {
      const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(true)), componentInstance: {} };
      dialog.open.mockReturnValue(dialogRef as unknown as MatDialogRef<any>);

      component.onRemove({ id: 'row-1', channelId: 'ch-1' });

      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.deleteGroupChannel({ groupId: 'mock_id', channelId: 'ch-1', id: 'row-1' }),
      );
    });

    it('should not dispatch deleteGroupChannel when dialog is cancelled', () => {
      const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(false)), componentInstance: {} };
      dialog.open.mockReturnValue(dialogRef as unknown as MatDialogRef<any>);
      jest.clearAllMocks();
      jest.spyOn(store, 'dispatch');

      component.onRemove({ id: 'row-1', channelId: 'ch-1' });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('openDialog', () => {
    it('should dispatch addGroupChannels with selected channel ids after dialog closes', () => {
      const result = { selectedItems: ['ch-a', 'ch-b'] };
      const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(result)) };
      dialog.open.mockReturnValue(dialogRef as unknown as MatDialogRef<any>);

      component.openDialog();

      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.addGroupChannels({ id: 'mock_id', channelIds: ['ch-a', 'ch-b'] }),
      );
    });

    it('should not dispatch addGroupChannels when dialog returns empty result', () => {
      const dialogRef = { afterClosed: jest.fn().mockReturnValue(of(null)) };
      dialog.open.mockReturnValue(dialogRef as unknown as MatDialogRef<any>);
      jest.clearAllMocks();
      jest.spyOn(store, 'dispatch');

      component.openDialog();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
