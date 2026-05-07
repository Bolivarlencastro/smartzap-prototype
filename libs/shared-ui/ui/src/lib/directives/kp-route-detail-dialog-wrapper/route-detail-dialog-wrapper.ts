import { AfterViewInit, Directive, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

@Directive()
export abstract class RouteDetailDialogWrapper<T> implements AfterViewInit, OnDestroy {
  private destroyListener: () => void;

  protected constructor(
    protected _document: Document,
    protected _renderer2: Renderer2,
    protected dialogRef: MatDialogRef<T>,
  ) {
    this.preserveScrollPosition(_document.documentElement, _renderer2, dialogRef);
  }

  ngAfterViewInit() {
    this.registerContainerClickListener();
  }

  ngOnDestroy() {
    this.removeContainerClickListener();
    this.restoreScrolling(this._document.documentElement, this._renderer2);
  }

  protected registerContainerClickListener() {
    const container = this._document.querySelectorAll('.route-dialog-container')?.item(0);

    if (!container) {
      return;
    }

    this.destroyListener = this._renderer2.listen(container, 'click', this.onBackdropClick);
  }

  private preserveScrollPosition(document: HTMLElement, renderer: Renderer2, dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => renderer.addClass(document, 'cdk-global-scrollblock'));
  }

  private restoreScrolling(document: HTMLElement, renderer: Renderer2) {
    renderer.removeClass(document, 'cdk-global-scrollblock');
  }

  private removeContainerClickListener() {
    if (this.destroyListener) {
      this.destroyListener();
    }
  }

  private onBackdropClick = (event: PointerEvent) => {
    const isBackdropClick = (event?.target as Element)?.classList?.contains('route-dialog-container');

    if (isBackdropClick) {
      this.dialogRef.close();
    }
  };
}
