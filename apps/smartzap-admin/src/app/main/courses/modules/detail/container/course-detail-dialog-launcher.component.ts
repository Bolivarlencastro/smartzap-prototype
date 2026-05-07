import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseDetailComponent } from './course-detail.component';

@Component({
  selector: 'app-course-detail-dialog-launcher',
  template: '',
})
export class CourseDetailDialogLauncherComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  private dialogRef?: MatDialogRef<CourseDetailComponent>;
  private destroying = false;

  ngOnInit(): void {
    this.dialogRef = this.dialog.open(CourseDetailComponent, {
      autoFocus: false,
      backdropClass: 'route-dialog-container',
      panelClass: 'smartzap-course-detail-dialog-panel',
      width: 'min(1080px, calc(100vw - 32px))',
      maxWidth: 'calc(100vw - 32px)',
    });

    this.dialogRef.afterClosed().subscribe(() => {
      if (!this.destroying) {
        this.router.navigate(['/courses']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroying = true;
    this.dialogRef?.close();
  }
}
