import { signal } from '@angular/core';
import { KpUploadDialogItem } from './kp-upload-dialog.component';

export class KpUploadDialogManager {
  readonly #uploads = signal<KpUploadDialogItem[]>([]);
  readonly uploads = this.#uploads.asReadonly();

  public removeUpload(uploadId: string) {
    this.#uploads.update((uploads) => uploads.filter((item) => item.id !== uploadId));
  }

  public cancelUpload(uploadId: string) {
    const upload = this.uploads().find((item) => item.id === uploadId);
    if (!upload) {
      return;
    }

    const isInProgress = upload.loading && upload.percentage < 100;
    if (isInProgress) {
      upload.subscription?.unsubscribe();
      this.updateUploadProgress(uploadId, 0, false);
      return;
    }

    this.removeUpload(uploadId);
  }

  public clearAllUploads() {
    this.#uploads().forEach((upload) => upload.subscription?.unsubscribe());
    this.#uploads.set([]);
  }

  public getUpload(uploadId: string) {
    return this.uploads().find((item) => item.id === uploadId);
  }

  protected addUpload(upload: KpUploadDialogItem) {
    this.#uploads.update((uploads) => [...uploads, upload]);
  }

  protected updateUploadProgress(uploadId: string, progress: number, loading: boolean) {
    this.#uploads.update((uploads) =>
      uploads.map((item) => {
        return item.id === uploadId ? { ...item, percentage: progress, loading } : item;
      }),
    );
  }
}
