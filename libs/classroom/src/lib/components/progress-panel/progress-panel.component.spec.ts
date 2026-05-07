import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { KpInfoDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-info-dialog';
import { ProgressPanelCardDialogData } from '../../models';
import { ProgressPanelComponent } from './progress-panel.component';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';

describe('ProgressPanelComponent', () => {
  let component: ProgressPanelComponent;
  let fixture: ComponentFixture<ProgressPanelComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressPanelComponent, getTranslocoTestingModule()],
      providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ProgressPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open info dialog', () => {
    const data: ProgressPanelCardDialogData = { title: 'Test Title', description: 'Test description' };
    component.openDialog(data);
    expect(dialog.open).toHaveBeenCalledWith(KpInfoDialogComponent, {
      autoFocus: 'dialog',
      data,
    });
  });
});
