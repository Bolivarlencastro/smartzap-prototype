import Quill from 'quill';
import Clipboard from 'quill/modules/clipboard';

export default class KpImageBlocker extends Clipboard {
  constructor(quill: Quill, options: unknown) {
    super(quill, options);
    this.registerDropListener();
  }

  override onCapturePaste(e: ClipboardEvent) {
    if (e.clipboardData.files.length) {
      this.stopEvent(e);
      return;
    }

    super.onCapturePaste(e);
  }

  handleDrop(e: DragEvent): void {
    if (e.dataTransfer.files.length) {
      this.stopEvent(e);
      return;
    }
  }

  private registerDropListener() {
    this.quill.root.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  private stopEvent(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
