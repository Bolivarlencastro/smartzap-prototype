import KpImageBlocker from './kp-image-blocker';
import Quill from 'quill';

describe('KpImageBlocker', () => {
  let imageBlocker: KpImageBlocker;
  const mockQuill: jest.Mocked<Quill> = { root: { addEventListener: jest.fn() } } as unknown as jest.Mocked<Quill>;

  beforeEach(() => {
    imageBlocker = new KpImageBlocker(mockQuill, {});
  });

  it('should block paste events with files', () => {
    const mockEvent = {
      clipboardData: { files: ['mockFile'] },
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as ClipboardEvent;

    imageBlocker.onCapturePaste(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should block drop events with files', () => {
    const mockEvent = {
      dataTransfer: { files: ['mockFile'] },
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    imageBlocker.handleDrop(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
