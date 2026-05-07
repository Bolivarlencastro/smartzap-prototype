import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialogRef } from '@angular/material/dialog';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { map } from 'rxjs';

export interface DialogSizeModel {
  width?: string;
  height?: string;
  mobileWidth?: string;
  mobileHeight?: string;
}

export function updateDialogSize(
  dialogRef: MatDialogRef<any>,
  breakpointObserver: BreakpointObserver,
  sizeConfig: DialogSizeModel,
) {
  const { width, height, mobileWidth = '90vw', mobileHeight = '95vh' } = sizeConfig;

  breakpointObserver
    .observe([`(max-width: ${constants.defaultMobileWidth})`])
    .pipe(map((result) => result.matches))
    .subscribe((isMobile) =>
      isMobile ? dialogRef.updateSize(mobileWidth, mobileHeight) : dialogRef.updateSize(width, height),
    );
}
