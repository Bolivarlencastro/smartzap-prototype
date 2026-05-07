import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ToolsHubListComponent } from './tools-hub-list.component';

describe('ToolsHubListComponent', () => {
  let component: ToolsHubListComponent;
  let fixture: ComponentFixture<ToolsHubListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsHubListComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsHubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit edit event', () => {
    const emitSpy = jest.spyOn(component.edit, 'emit');
    const item: CustomMenuItem = { id: '123', name: 'Google', url: 'https://www.google.com', icon: 'search' };

    component.onEdit(item);

    expect(emitSpy).toHaveBeenCalledWith(item);
  });

  it('should emit remove event', () => {
    const emitSpy = jest.spyOn(component.remove, 'emit');
    const id = '123';

    component.onRemove(id);

    expect(emitSpy).toHaveBeenCalledWith(id);
  });
});
