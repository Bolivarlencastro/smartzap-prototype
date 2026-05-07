import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToolsHubActions } from './store';
import { toolsHubInitialState } from './store/tools-hub.feature';
import { ToolsHubComponent } from './tools-hub.component';

describe('ToolsHubComponent', () => {
  let component: ToolsHubComponent;
  let fixture: ComponentFixture<ToolsHubComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsHubComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: toolsHubInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ToolsHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch reset action', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(ToolsHubActions.reset());
  });

  describe('openConfigDialog', () => {
    it('should dispatch openConfigDialog action when create a tool', () => {
      component.onCreate();
      expect(store.dispatch).toHaveBeenCalledWith(ToolsHubActions.openConfigDialog({}));
    });

    it('should dispatch openConfigDialog action when edit a tool', () => {
      const item: CustomMenuItem = { id: '123', name: 'Google', url: 'https://www.google.com', icon: 'search' };
      component.onEdit(item);
      expect(store.dispatch).toHaveBeenCalledWith(ToolsHubActions.openConfigDialog({ item }));
    });
  });

  it('should dispatch remove action', () => {
    const id = '123';
    component.onRemove(id);
    expect(store.dispatch).toHaveBeenCalledWith(ToolsHubActions.remove({ id }));
  });
});
