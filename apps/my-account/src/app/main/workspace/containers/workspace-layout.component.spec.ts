import { ComponentFixture, TestBed } from '@angular/core/testing';
import { globalSettingsInitialState } from '@app/shared/store/features';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { WorkspaceImageUploadComponent } from 'app/main/workspace/containers/workspace-image-upload.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WorkspaceLayoutComponent', () => {
  let component: WorkspaceLayoutComponent;
  let fixture: ComponentFixture<WorkspaceLayoutComponent>;
  let store: MockStore;

  beforeEach(async () => {
    TestBed.overrideComponent(WorkspaceLayoutComponent, {
      remove: { imports: [WorkspaceImageUploadComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [WorkspaceLayoutComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { ['globalSettings']: globalSettingsInitialState } }),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(WorkspaceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch updateWorkspaceCustomColor action', () => {
    component.colorChanged('#FFFFFF');
    expect(store.dispatch).toHaveBeenCalledWith(
      GlobalSettingsActions.updateWorkspaceCustomColor({ custom_color: '#FFFFFF' }),
    );
  });

  it('should dispatch updateWorkspaceDarkTheme action', () => {
    component.toggleDarkTheme(false);
    expect(store.dispatch).toHaveBeenCalledWith(GlobalSettingsActions.updateWorkspaceDarkTheme({ theme_dark: false }));
  });
});
