import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { ToolsHubHeaderComponent } from './tools-hub-header.component';

describe('ToolsHubHeaderComponent', () => {
  let component: ToolsHubHeaderComponent;
  let fixture: ComponentFixture<ToolsHubHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsHubHeaderComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsHubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit create event', () => {
    const emitSpy = jest.spyOn(component.create, 'emit');
    component.onCreate();
    expect(emitSpy).toHaveBeenCalled();
  });
});
