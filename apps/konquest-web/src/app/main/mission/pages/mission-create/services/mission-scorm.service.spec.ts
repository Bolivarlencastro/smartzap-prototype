import { KontentLearnContentAPI } from '@core/api';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MissionScormService } from './mission-scorm.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('MissionScormService', () => {
  let service: MissionScormService;
  let mockLearnContentApi: jest.Mocked<KontentLearnContentAPI>;
  let mockStore: jest.Mocked<Store>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockLearnContentApi = { scormUpload: jest.fn() } as unknown as jest.Mocked<KontentLearnContentAPI>;
    mockStore = { dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    mockDialog = { open: jest.fn(), getDialogById: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    mockRouter = { navigate: jest.fn().mockResolvedValue({}) } as unknown as jest.Mocked<Router>;
    service = new MissionScormService(mockDialog, mockLearnContentApi, mockStore, mockRouter);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call scorm upload api with duration 0 when duration is null', () => {
    const stubValue = of('stub value');
    mockLearnContentApi.scormUpload.mockReturnValue(stubValue);

    service.import(null);

    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledTimes(1);
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledWith(null, '0');
  });

  it('should not accept invalid duration time', () => {
    const stubValue = of('stub value');
    mockLearnContentApi.scormUpload.mockReturnValue(stubValue);

    let shouldThrow = () => service.import('gdfgsd:sfasdf:sdfasdf');
    expect(shouldThrow).toThrow(`Invalid duration time: gdfgsd:sfasdf:sdfasdf`);

    shouldThrow = () => service.import('22:abc');
    expect(shouldThrow).toThrow(`Invalid duration time: 22:abc`);

    shouldThrow = () => service.import('2230');
    expect(shouldThrow).toThrow(`Invalid duration time: 2230`);
  });

  it('should call scorm upload api with 600 seconds', () => {
    const stubValue = of('stub value');
    mockLearnContentApi.scormUpload.mockReturnValue(stubValue);
    service.import('00:10');
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledTimes(1);
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledWith(null, '600');
  });

  it('should call scorm upload api with 36000 seconds', () => {
    const stubValue = of('stub value');
    mockLearnContentApi.scormUpload.mockReturnValue(stubValue);
    service.import('10:00');
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledTimes(1);
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledWith(null, '36000');
  });

  it('should call scorm upload api with 3600 seconds', () => {
    const stubValue = of('stub value');
    mockLearnContentApi.scormUpload.mockReturnValue(stubValue);
    service.import('1:00');
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledTimes(1);
    expect(mockLearnContentApi.scormUpload).toHaveBeenCalledWith(null, '3600');
  });

  it('navigate to the scorm mission creation page after uploading a content', () => {
    mockLearnContentApi.scormUpload.mockReturnValue(of({ type: HttpEventType.Response, body: { contents: {} } }));
    service.import('1:00');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['missions/create/scorm/info']);
  });
});
