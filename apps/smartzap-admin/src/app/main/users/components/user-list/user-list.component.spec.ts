import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '../../model';
import { UserListComponent } from './user-list.component';
import { Page } from '@app/shared/model';
import { PageEvent } from '@angular/material/paginator';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    component.datasource = [];
    component.page = { count: 0, per_page: 10, page: 1 } as Page;
    fixture.detectChanges();
  });

  it('should emit sort event when direction is not provided', () => {
    const emitSpy = jest.spyOn(component.sortEvent, 'emit');
    const event = { direction: undefined, active: 'columnName' };

    component.sortData(event);
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should emit sort event when direction is "asc"', () => {
    const emitSpy = jest.spyOn(component.sortEvent, 'emit');
    const event = { direction: 'asc', active: 'columnName' };

    component.sortData(event);
    expect(emitSpy).toHaveBeenCalledWith('columnName');
  });

  it('should emit sort event when direction is "desc"', () => {
    const emitSpy = jest.spyOn(component.sortEvent, 'emit');
    const event = { direction: 'desc', active: 'columnName' };

    component.sortData(event);
    expect(emitSpy).toHaveBeenCalledWith('-columnName');
  });

  it('should emit userSelected event with user id and selected state', () => {
    const userSelectedSpy = jest.spyOn(component.userSelected, 'emit');
    const user = { id: '1', selected: false } as User;

    component.toggleSelected(user);
    expect(userSelectedSpy).toHaveBeenCalledWith({
      id: user.id,
      selected: true,
    });
  });

  it('should emit deleteSelected event with selected user ids', () => {
    const deleteSelectedSpy = jest.spyOn(component.deleteSelected, 'emit');
    const expectedUserIds = ['1', '3'];
    fixture.componentRef.setInput('datasource', [
      { id: '1', selected: true },
      { id: '2', selected: false },
      { id: '3', selected: true },
    ] as User[]);

    component.handleDeleteSelected();
    expect(deleteSelectedSpy).toHaveBeenCalledWith(expectedUserIds);
  });

  it('should emit selectAll', () => {
    const spy = jest.spyOn(component.selectAll, 'emit');

    component.toggleSelectAll();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit pageChange event and reset scroll top', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    const changeScrollTopSpy = jest.spyOn<any, any>(component, 'changeScrollTop');
    const event = { pageIndex: 1, pageSize: 10, length: 100 } as PageEvent;

    component.handlePageChange(event);
    expect(pageChangeSpy).toHaveBeenCalledWith(event);
    expect(changeScrollTopSpy).toHaveBeenCalled();
  });

  describe('hasUserSelected', () => {
    it('should return true when at least one user is selected', () => {
      fixture.componentRef.setInput('datasource', [
        { id: '1', selected: true },
        { id: '2', selected: false },
        { id: '3', selected: false },
      ] as User[]);
      const result = component.hasUserSelected;

      expect(result).toBe(true);
    });

    it('should return false when no user is selected', () => {
      fixture.componentRef.setInput('datasource', [
        { id: '1', selected: false },
        { id: '2', selected: false },
      ] as User[]);
      const result = component.hasUserSelected;

      expect(result).toBe(false);
    });
  });

  describe('isAllSelected', () => {
    it('should return true when all users are selected', () => {
      fixture.componentRef.setInput('datasource', [
        { id: '1', selected: true },
        { id: '2', selected: true },
        { id: '3', selected: true },
      ] as User[]);
      const result = component.isAllSelected;

      expect(result).toBe(true);
    });

    it('should return false when at least one user is not selected', () => {
      fixture.componentRef.setInput('datasource', [
        { id: '1', selected: true },
        { id: '2', selected: false },
      ] as User[]);
      const result = component.isAllSelected;

      expect(result).toBe(false);
    });
  });
});
