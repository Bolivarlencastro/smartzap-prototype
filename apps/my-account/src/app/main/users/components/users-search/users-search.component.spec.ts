import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSearchFilter } from '@app/shared/model';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { UsersSearchComponent } from './users-search.component';

describe('UsersSearchComponent', () => {
  let component: UsersSearchComponent;
  let fixture: ComponentFixture<UsersSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSearchComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersSearchComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filterLists', {
      roles: [],
      statuses: [],
      jobPositions: [],
      activityAreas: [],
      directors: [],
      managers: [],
      leaders: [],
    });

    fixture.detectChanges();
  });

  describe('filterForm', () => {
    it('should initialize the form with correct controls', () => {
      expect(component.filterForm).toBeDefined();
      expect(component.filterForm.controls['status']).toBeDefined();
      expect(component.filterForm.controls['roleId']).toBeDefined();
    });

    it('should emit filterChanged event when form is changed', () => {
      const emitSpy = jest.spyOn(component.filterChanged, 'emit');

      const data: UserSearchFilter = {
        roleId: ['1'],
        status: true,
        jobPositions: ['1', '3', '4'],
        activityAreas: ['1'],
        directors: ['1', '2', '3'],
        managers: ['3', '4'],
        leaders: [''],
      };

      component.filterForm.patchValue(data);
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith({
        ...data,
      });
    });
  });

  describe('columnForm', () => {
    it('should initialize the form with correct controls', () => {
      expect(component.columnForm).toBeDefined();
      expect(component.columnForm.controls['name']).toBeDefined();
      expect(component.columnForm.controls['email']).toBeDefined();
      expect(component.columnForm.controls['phone']).toBeDefined();
      expect(component.columnForm.controls['jobPosition']).toBeDefined();
      expect(component.columnForm.controls['activityArea']).toBeDefined();
      expect(component.columnForm.controls['directorate']).toBeDefined();
      expect(component.columnForm.controls['subdirectorate']).toBeDefined();
      expect(component.columnForm.controls['leader']).toBeDefined();
      expect(component.columnForm.controls['permissions']).toBeDefined();
      expect(component.columnForm.controls['status']).toBeDefined();
    });

    it('should set form controls correctly', () => {
      expect(component.columnForm.controls['name'].disabled).toBe(true);
      expect(component.columnForm.controls['email'].disabled).toBe(false);
      expect(component.columnForm.controls['phone'].disabled).toBe(false);

      expect(component.columnForm.controls['jobPosition'].disabled).toBe(false);
      expect(component.columnForm.controls['activityArea'].disabled).toBe(false);
      expect(component.columnForm.controls['directorate'].disabled).toBe(false);
      expect(component.columnForm.controls['subdirectorate'].disabled).toBe(false);
      expect(component.columnForm.controls['leader'].disabled).toBe(false);
      expect(component.columnForm.controls['permissions'].disabled).toBe(false);

      expect(component.columnForm.controls['status'].disabled).toBe(true);
    });

    it('should emit displayedColumnsChanged when form values change', () => {
      const emitSpy = jest.spyOn(component.displayedColumnsChanged, 'emit');

      component.columnForm.controls['email'].setValue(false);
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith([
        'select',
        'name',
        'phone',
        'jobPosition',
        'activityArea',
        'directorate',
        'subdirectorate',
        'leader',
        'permissions',
        'status',
      ]);
    });
  });
});
