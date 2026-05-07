import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../utils';
import { AluraStatusColorPipe } from '../../utils/pipes/alura-status-color.pipe';
import { ManagementListComponent } from './management-list.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MirroredCourse, UpdateActiveStatusBatchDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';

describe('ManagementListComponent', () => {
  let component: ManagementListComponent;
  let fixture: ComponentFixture<ManagementListComponent>;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<KpConfirmDialogComponent>;
  const chance = new Chance();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManagementListComponent,
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        AluraStatusColorPipe,
        NgxSkeletonLoaderModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconTestingModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSortModule,
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            componentInstance: { confirmMessage: '', confirmTitle: '', positiveButtonLabel: '' },
            close: jest.fn(),
            afterClosed: jest.fn(() => of(true)),
          },
        },
      ],
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    fixture = TestBed.createComponent(ManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit pageChanged event', () => {
    const event = { pageIndex: 2, pageSize: 10 } as PageEvent;
    const emitSpy = jest.spyOn(component.pageChanged, 'emit');

    component.onPageChange(event);

    expect(emitSpy).toHaveBeenCalledWith({ currentPage: 3, perPage: 10 });
  });

  it('should open a new browser tab', () => {
    const url = 'https://alura.com.br';
    const openSpy = jest.spyOn(window, 'open').mockImplementation();

    component.onOpenCourse({ link: url } as MirroredCourse);

    expect(openSpy).toHaveBeenCalledWith(url, '_blank');
  });

  describe('onSort', () => {
    const cases: any[] = [
      [{ active: 'name', direction: 'asc' }, 'name'],
      [{ active: 'name', direction: 'desc' }, '-name'],
      [{ active: 'name', direction: null }, null],
    ];

    test.each(cases)('should return the correct value when the sort configuration is " %p "', (config, result) => {
      const emitSpy = jest.spyOn(component.sort, 'emit');

      component.onSort(config);

      expect(emitSpy).toHaveBeenCalledWith(result);
    });
  });

  it('should emit openCourseMirrorDialog event', () => {
    const openSpy = jest.spyOn(component.openCourseMirrorDialog, 'emit');

    component.onOpenCourseMirrorDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open confirm dialog on onDelete and emit delete event', () => {
    const emitSpy = jest.spyOn(component.delete, 'emit');

    component.onDelete({ id: '1' } as MirroredCourse);
    matDialogRef.close();

    expect(matDialog.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    expect(matDialogRef.componentInstance.confirmTitle).toBe('INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.TITLE');
    expect(matDialogRef.componentInstance.confirmMessage).toBe(
      'INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.MESSAGE',
    );
    expect(matDialogRef.componentInstance.positiveButtonLabel).toBe(
      'INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.CONFIRM_BUTTON',
    );
    expect(emitSpy).toHaveBeenCalledWith(['1']);
  });

  describe('onToggleActive', () => {
    it('should emit toggleActive event when passing a courseId', () => {
      const openSpy = jest.spyOn(component.toggleActive, 'emit');
      const event = { checked: true } as MatSlideToggleChange;
      const expectedPayload: UpdateActiveStatusBatchDto = { courseIds: ['1'], isActive: true };

      component.onToggleActive(event, '1');

      expect(openSpy).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit toggleActive event when not passing a courseId', () => {
      const openSpy = jest.spyOn(component.toggleActive, 'emit');
      const event = { checked: true } as MatSlideToggleChange;
      const course = { id: '2' } as MirroredCourse;
      const expectedPayload: UpdateActiveStatusBatchDto = { courseIds: ['2'], isActive: true };
      component.selection.setSelection(course);

      component.onToggleActive(event);

      expect(openSpy).toHaveBeenCalledWith(expectedPayload);
    });
  });

  it('should emit openDetailDialog event', () => {
    const course = { id: chance.guid(), missionId: chance.guid() } as MirroredCourse;
    const openSpy = jest.spyOn(component.openDetailDialog, 'emit');

    component.onOpenDetailDialog(course);

    expect(openSpy).toHaveBeenCalledWith(course.missionId);
  });
});
