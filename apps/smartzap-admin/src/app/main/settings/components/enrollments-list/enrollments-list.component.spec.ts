import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { EnrollmentsListComponent } from './enrollments-list.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

class MatDialogMock {
  open(_component: any): any {
    return {
      afterClosed: () => of(true),
      componentInstance: { confirmTitle: '', confirmMessage: '' },
    };
  }
}

describe('EnrollmentsListComponent', () => {
  let component: EnrollmentsListComponent;
  let fixture: ComponentFixture<EnrollmentsListComponent>;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsListComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: MatDialog,
          useClass: MatDialogMock,
        },
      ],
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(EnrollmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('handleDelete', () => {
    it('should open delete confirmation dialog', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open');

      component.handleDelete(enrollment);

      expect(matDialog.open).toHaveBeenCalled();
    });

    it('should emit deleteEnrollment when confirming deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.deleteEnrollment, 'emit');

      component.handleDelete(enrollment);

      expect(component.deleteEnrollment.emit).toHaveBeenCalled();
    });

    it('should not emit deleteEnrollment when canceling deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.deleteEnrollment, 'emit');

      component.handleDelete(enrollment);

      expect(component.deleteEnrollment.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleCancel', () => {
    it('should open cancel confirmation dialog', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open');

      component.handleCancel(enrollment);

      expect(matDialog.open).toHaveBeenCalled();
    });

    it('should emit cancelEnrollment when confirming deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.cancelEnrollment, 'emit');

      component.handleCancel(enrollment);

      expect(component.cancelEnrollment.emit).toHaveBeenCalled();
    });

    it('should not emit cancelEnrollment when canceling deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.cancelEnrollment, 'emit');

      component.handleCancel(enrollment);

      expect(component.cancelEnrollment.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleChangePage', () => {
    it('should emit page event', () => {
      const event: PageEvent = { pageIndex: 0, previousPageIndex: 0, pageSize: 0, length: 0 };
      jest.spyOn(component.pageChanged, 'emit');

      component.handleChangePage(event);

      expect(component.pageChanged.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('handleSort', () => {
    it('should emit sort event', () => {
      const event: Sort = { active: 'name', direction: 'asc' };
      jest.spyOn(component.sortChanged, 'emit');

      component.handleSort(event);

      expect(component.sortChanged.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('handleReenroll', () => {
    it('should open reenroll confirmation dialog', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open');

      component.handleReenroll(enrollment);

      expect(matDialog.open).toHaveBeenCalled();
    });

    it('should emit reenroll when confirming deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.reenroll, 'emit');

      component.handleReenroll(enrollment);

      expect(component.reenroll.emit).toHaveBeenCalled();
    });

    it('should not emit reenroll when canceling deletion', () => {
      const enrollment = {} as any;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        componentInstance: { confirmTitle: '', confirmMessage: '' },
      } as any);
      jest.spyOn(component.reenroll, 'emit');

      component.handleReenroll(enrollment);

      expect(component.reenroll.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleOpenActivities', () => {
    it('should emit openActivities event', () => {
      const enrollment = {} as any;
      jest.spyOn(component.openActivities, 'emit');

      component.handleOpenActivities(enrollment);

      expect(component.openActivities.emit).toHaveBeenCalledWith(enrollment);
    });
  });
});
