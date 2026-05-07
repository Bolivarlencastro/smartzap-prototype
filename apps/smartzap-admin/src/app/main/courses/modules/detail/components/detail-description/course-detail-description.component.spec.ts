import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CourseDetailDescriptionComponent } from './course-detail-description.component';
import { getTranslocoTestingModule } from '@app/shared/test/transloco-testing.module';

describe('CourseDetailDescriptionComponent', () => {
  let component: CourseDetailDescriptionComponent;
  let fixture: ComponentFixture<CourseDetailDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailDescriptionComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: () => of('new summary'),
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit update event when dialog is closed with a result', () => {
    jest.spyOn(component.update, 'emit');
    component.openDialog();
    expect(component.update.emit).toHaveBeenCalledWith('new summary');
  });
});
