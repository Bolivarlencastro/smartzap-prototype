import { PulseUploadService } from './pulse-upload.service';
import { Subject } from 'rxjs';

describe('PulseUploadService', () => {
  let service: PulseUploadService;

  beforeEach(() => {
    service = new PulseUploadService();
  });

  it('should generate a random upload id', () => {
    expect(service.getRandomUploadId()).toBeDefined();
  });

  describe('addFileUpload', () => {
    it('should add a new file upload', () => {
      const id = service.getRandomUploadId();
      service.addFileUpload(id, 'mockUploadName', new Subject());
      const uploads = service.displayedUploads();
      const upload = uploads.at(0);
      expect(uploads.length).toBe(1);
      expect(upload.id).toBeDefined();
      expect(upload.name).toBe('mockUploadName');
      expect(upload.loading).toBe(true);
      expect(upload.percentage).toBe(0);
    });

    it('should add a new file upload with initial percentage', () => {
      const id = service.getRandomUploadId();
      service.addFileUpload(id, 'mockUploadName', new Subject(), 50);
      const uploads = service.displayedUploads();
      const upload = uploads.at(0);
      expect(upload.percentage).toBe(50);
    });
  });

  describe('cancelFileUpload', () => {
    let uploadId: string;
    let cancelSubject: Subject<void>;

    beforeEach(() => {
      uploadId = service.getRandomUploadId();
      cancelSubject = new Subject<void>();
      service.addFileUpload(uploadId, 'mockUploadName', cancelSubject);
    });

    it('should cancel a file upload', () => {
      const cancelSpy = jest.spyOn(cancelSubject, 'next');
      service.cancelFileUpload(uploadId);
      const upload = service.displayedUploads().at(0);
      expect(upload.loading).toBe(false);
      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should remove a file upload when it is already cancelled', () => {
      service.cancelFileUpload(uploadId);
      service.cancelFileUpload(uploadId);
      const uploads = service.displayedUploads();
      expect(uploads.length).toBe(0);
    });
  });

  describe('updateFileUpload', () => {
    it('should update an upload progress', () => {
      service.addFileUpload('id', 'mockUploadName', new Subject());
      service.updateFileUpload('id', 50);
      const upload = service.displayedUploads().at(0);
      expect(upload.percentage).toBe(50);
      expect(upload.loading).toBe(true);
    });

    it('should set loading to false if progress equals 100', () => {
      service.addFileUpload('id', 'mockUploadName', new Subject());
      service.updateFileUpload('id', 100);
      const upload = service.displayedUploads().at(0);
      expect(upload.loading).toBe(false);
    });
  });

  describe('clearUploads', () => {
    it('should cancel all current uploads and clear the upload list', () => {
      const uploadId = service.getRandomUploadId();
      const cancelSubject = new Subject<void>();
      const cancelSpy = jest.spyOn(cancelSubject, 'next');
      service.addFileUpload(uploadId, 'mockUploadName', cancelSubject);
      service.clearUploads();
      expect(cancelSpy).toHaveBeenCalled();
      expect(service.displayedUploads().length).toBe(0);
    });
  });
});
