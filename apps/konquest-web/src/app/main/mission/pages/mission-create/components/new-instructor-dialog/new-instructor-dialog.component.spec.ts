import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NewInstructorData } from 'app/main/mission/mission.model';
import { NewInstructorDialogComponent } from './new-instructor-dialog.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('NewInstructorDialogComponent', () => {
  let component: NewInstructorDialogComponent;
  let fixture: ComponentFixture<NewInstructorDialogComponent>;
  const dialogRefSpy = { close: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewInstructorDialogComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInstructorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close the dialog returning the new instructor data', () => {
    const expectedFormValue: NewInstructorData = {
      name: 'Test',
      email: 'test@email.com',
      avatar: undefined,
      avatarData: undefined,
    } as any;
    component.newInstructorForm.patchValue(expectedFormValue);
    component.addInstructor();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(expectedFormValue);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
