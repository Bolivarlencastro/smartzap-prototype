import { KpBlockCopyPasteDirective } from './kp-block-copy-paste.directive';

describe('KpBlockCopyPasteDirective', () => {
  let directive: KpBlockCopyPasteDirective;

  beforeEach(() => {
    directive = new KpBlockCopyPasteDirective();
  });

  it('should prevent the copy event', () => {
    const mockEvent = { preventDefault: jest.fn(), type: 'copy' } as unknown as ClipboardEvent;

    directive.onEvent(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should prevent the cut event', () => {
    const mockEvent = { preventDefault: jest.fn(), type: 'cut' } as unknown as ClipboardEvent;

    directive.onEvent(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should prevent the paste event', () => {
    const mockEvent = { preventDefault: jest.fn(), type: 'paste' } as unknown as ClipboardEvent;

    directive.onEvent(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not call preventDefault for unrelated events', () => {
    const unrelatedEvent = { preventDefault: jest.fn(), type: 'keydown' } as unknown as Event;

    expect(unrelatedEvent.preventDefault).not.toHaveBeenCalled();
  });
});
