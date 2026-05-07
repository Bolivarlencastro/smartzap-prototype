import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ContentUploadService } from '../../services/content-upload.service';
import { missionCreateFeatureKey, missionCreateInitialState } from '../../store';

import { MissionContentComponent } from './mission-content.component';
import { KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MissionContentFormComponent } from '../../components/forms/mission-content-form/mission-content-form.component';

describe('MissionContentComponent', () => {
  let component: MissionContentComponent;
  let fixture: ComponentFixture<MissionContentComponent>;
  let contentUploadServiceMock: jest.Mocked<ContentUploadService>;

  beforeEach(async () => {
    contentUploadServiceMock = {
      uploads: signal([]),
      cancelUpload: jest.fn(),
    } as unknown as jest.Mocked<ContentUploadService>;

    TestBed.overrideComponent(MissionContentComponent, {
      remove: { imports: [MissionContentFormComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [MissionContentComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { [missionCreateFeatureKey]: missionCreateInitialState } }),
        {
          provide: ContentUploadService,
          useValue: contentUploadServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onUploadRemove', () => {
    it('should call cancelUpload', () => {
      const mockItem: KpUploadDialogItem = { id: 'mock_id' } as KpUploadDialogItem;

      component.onUploadRemove(mockItem);

      expect(contentUploadServiceMock.cancelUpload).toHaveBeenCalledWith('mock_id');
    });
  });
});
