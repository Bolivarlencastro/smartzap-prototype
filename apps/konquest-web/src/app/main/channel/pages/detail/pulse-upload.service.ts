import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';

type PulseUploadItem = KpUploadDialogItem & { cancelSubject: Subject<void> };
type FilesUpload = Map<string, PulseUploadItem>;

@Injectable({ providedIn: 'root' })
export class PulseUploadService {
  private readonly currentUploads: WritableSignal<FilesUpload>;
  readonly displayedUploads: Signal<KpUploadDialogItem[]>;

  constructor() {
    this.currentUploads = signal<FilesUpload>(new Map());
    this.displayedUploads = computed(() => {
      const uploads = this.currentUploads().values();
      return Array.from(uploads);
    });
  }

  getRandomUploadId() {
    return Math.random().toString(36).substring(2, 9);
  }

  addFileUpload(uploadId: string, uploadName: string, cancelSubject: Subject<void>, initialPercentage = 0) {
    const upload: PulseUploadItem = {
      id: uploadId,
      name: uploadName,
      loading: true,
      cancelSubject,
      percentage: initialPercentage,
    };
    this.currentUploads.update((current) => new Map(current).set(uploadId, upload));
  }

  updateFileUpload(uploadId: string, progress: number) {
    const upload = this.currentUploads().get(uploadId);
    upload.percentage = progress;
    upload.loading = progress > 0 && progress < 100;
    this.currentUploads.update((current) => new Map(current).set(uploadId, upload));
  }

  cancelFileUpload(uploadId: string) {
    const upload = this.currentUploads().get(uploadId);
    if (!upload) {
      return;
    }
    if (upload.loading) {
      this.cancelUpload(upload);
      return;
    }
    this.removeUpload(upload);
  }

  clearUploads() {
    const uploads = this.currentUploads();
    uploads.forEach((upload) => upload.cancelSubject.next());
    this.currentUploads.set(new Map());
  }

  private cancelUpload(upload: PulseUploadItem) {
    upload.cancelSubject.next();
    this.currentUploads.update((uploads) => {
      return new Map(uploads).set(upload.id, {
        ...upload,
        loading: false,
        subscription: undefined,
      });
    });
  }

  private removeUpload(upload: PulseUploadItem) {
    this.currentUploads.update((uploads) => {
      const updated = new Map(uploads);
      updated.delete(upload.id);
      return updated;
    });
  }
}
