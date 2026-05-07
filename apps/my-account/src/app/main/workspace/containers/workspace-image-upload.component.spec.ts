import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { globalSettingsInitialState } from '@app/shared/store/features';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { WorkspaceImageUploadComponent } from './workspace-image-upload.component';

describe('WorkspaceImageUploadComponent', () => {
  let component: WorkspaceImageUploadComponent;
  let fixture: ComponentFixture<WorkspaceImageUploadComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [getTranslocoTestingModule(), WorkspaceImageUploadComponent],
      providers: [
        provideMockStore({ initialState: { ['globalSettings']: globalSettingsInitialState } }),
        { provide: WorkspaceService, useValue: { getCurrentWorkspace: jest.fn(() => ({ id: '123' })) } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(WorkspaceImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('updateWorkspaceImage', () => {
    it('should dispatch updateWorkspaceImage action when upload logo', () => {
      const file = new File([], 'image.png');
      component.uploadLogo(file);
      expect(store.dispatch).toHaveBeenCalledWith(
        GlobalSettingsActions.updateWorkspaceImage({ payload: { workspaceId: '123', file, type: 'logo' } }),
      );
    });

    it('should dispatch updateWorkspaceImage action when upload icon', () => {
      const file = new File([], 'image.png');
      component.uploadIcon(file);
      expect(store.dispatch).toHaveBeenCalledWith(
        GlobalSettingsActions.updateWorkspaceImage({ payload: { workspaceId: '123', file, type: 'icon' } }),
      );
    });
  });
});
