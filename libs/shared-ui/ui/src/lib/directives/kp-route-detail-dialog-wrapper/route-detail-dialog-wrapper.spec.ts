import { RouteDetailDialogWrapper } from './route-detail-dialog-wrapper';
import { Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';

class MockDialogWrapper extends RouteDetailDialogWrapper<MockDialogWrapper> {
  constructor(
    protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<MockDialogWrapper>,
  ) {
    super(_document, _renderer2, dialogRef);
  }
}

describe('RouteDetailDialogWrapper', () => {
  const mockElement: jest.Mocked<Element> = { addEventListener: jest.fn() } as unknown as jest.Mocked<Element>;
  const destroyListenerMock = jest.fn();
  let documentMock: jest.Mocked<Document>;
  let rendererMock: jest.Mocked<Renderer2>;
  let dialogRefMock: jest.Mocked<MatDialogRef<any>>;
  let dialogWrapper: MockDialogWrapper;

  beforeEach(() => {
    documentMock = {
      querySelectorAll: jest.fn().mockReturnValue({
        item: jest.fn((_index: number) => mockElement),
      }),
    } as unknown as jest.Mocked<Document>;
    rendererMock = {
      listen: jest.fn().mockReturnValue(destroyListenerMock),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;
    dialogRefMock = {
      close: jest.fn(),
      afterOpened: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MatDialogRef<any>>;

    dialogWrapper = new MockDialogWrapper(documentMock, rendererMock, dialogRefMock);
  });

  it('should call preserveScrollPosition when created', () => {
    const spy = jest.spyOn(rendererMock, 'addClass');

    expect(spy).toHaveBeenCalledWith(documentMock.documentElement, 'cdk-global-scrollblock');
  });

  it('should call restoreScrolling when destroyed', () => {
    const spy = jest.spyOn(rendererMock, 'removeClass');

    dialogWrapper.ngOnDestroy();

    expect(spy).toHaveBeenCalledWith(documentMock.documentElement, 'cdk-global-scrollblock');
  });

  it('should register the container click listener after initialization', () => {
    dialogWrapper.ngAfterViewInit();

    expect(rendererMock.listen).toHaveBeenCalledWith(mockElement, 'click', expect.anything());
  });

  it('should call the destroy listener function when destroyed', () => {
    dialogWrapper.ngAfterViewInit();
    dialogWrapper.ngOnDestroy();

    expect(destroyListenerMock).toHaveBeenCalled();
  });
});
