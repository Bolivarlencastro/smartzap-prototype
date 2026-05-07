import { KpUploadDialogManager } from './kp-upload-dialog-manager';
import { KpUploadDialogItem } from './kp-upload-dialog.component';
import { Chance } from 'chance';
import { Subscription } from 'rxjs';

class MockManager extends KpUploadDialogManager {
  constructor() {
    super();
  }

  add(upload: KpUploadDialogItem) {
    this.addUpload(upload);
  }

  updateProgress(id: string, progress: number, loading: boolean) {
    this.updateUploadProgress(id, progress, loading);
  }
}

describe('KpUploadDialogManager', () => {
  let manager: MockManager;
  const chance = new Chance();

  const createUpload = (overrides: Partial<KpUploadDialogItem> = {}): KpUploadDialogItem => {
    const mockSubscription = { unsubscribe: jest.fn() } as unknown as jest.Mocked<Subscription>;
    return {
      id: chance.guid(),
      percentage: 0,
      loading: false,
      subscription: mockSubscription,
      ...overrides,
    } as KpUploadDialogItem;
  };

  beforeEach(() => {
    manager = new MockManager();
  });

  it('should start with an empty uploads list', () => {
    expect(manager.uploads()).toEqual([]);
  });

  it('should add and remove an upload', () => {
    const upload = createUpload();

    manager.add(upload);
    expect(manager.getUpload(upload.id)).toEqual(upload);

    manager.removeUpload(upload.id);
    expect(manager.uploads().length).toBe(0);
  });

  describe('cancelUpload', () => {
    it('should do nothing when upload is not found', () => {
      manager.cancelUpload('missing');
      expect(manager.uploads().length).toBe(0);
    });

    it('should cancel the upload but keep the item when upload still in progress', () => {
      const upload = createUpload({ loading: true, percentage: 50 });

      manager.add(upload);
      manager.cancelUpload(upload.id);

      expect(upload.subscription.unsubscribe).toHaveBeenCalled();
      const updatedUpload = manager.getUpload(upload.id);
      expect(updatedUpload.loading).toBe(false);
      expect(updatedUpload.percentage).toBe(0);
    });

    it('should remove the item if it is not in progress', () => {
      const upload = createUpload({ loading: false, percentage: 100 });

      manager.add(upload);
      manager.cancelUpload(upload.id);

      expect(manager.uploads().length).toBe(0);
    });
  });

  describe('clearAllUploads', () => {
    it('should unsubscribe all uploads and clear the list', () => {
      const firstUpload = createUpload();
      const secondUpload = createUpload();
      manager.add(firstUpload);
      manager.add(secondUpload);

      manager.clearAllUploads();

      expect(firstUpload.subscription.unsubscribe).toHaveBeenCalled();
      expect(secondUpload.subscription.unsubscribe).toHaveBeenCalled();
      expect(manager.uploads().length).toBe(0);
    });
  });

  describe('updateUploadProgress', () => {
    it('should update the percentage and loading state', () => {
      const upload = createUpload({ loading: true, percentage: 10 });
      manager.add(upload);
      manager.updateProgress(upload.id, 75, false);

      const updatedUpload = manager.getUpload(upload.id);

      expect(updatedUpload.percentage).toBe(75);
      expect(updatedUpload.loading).toBe(false);
    });
  });
});
