import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { WorkspaceFormComponent } from './workspace-form.component';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('WorkspaceFormComponent', () => {
  let component: WorkspaceFormComponent;
  let fixture: ComponentFixture<WorkspaceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceFormComponent, getTranslocoTestingModule()],
      providers: [{ provide: UserProfileService, useValue: { hasRoles: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit updated event', () => {
    const emitSpy = jest.spyOn(component.updated, 'emit');
    const expectedValue = {
      id: '1',
      name: 'Name Test',
      doc_number: '555',
      duns_number: '444',
      description: 'Something',
      address: 'Av. Somewhere',
      city: 'Campina Grande',
      state: 'Paraíba',
      post_code: '83',
      country: 'Brazil',
      hash_id: 'cy60m1vj',
    };
    component.form.patchValue(expectedValue);

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith(expectedValue);
  });

  it('should emit deleted event', () => {
    const emitSpy = jest.spyOn(component.deleted, 'emit');
    component.onDelete('123');
    expect(emitSpy).toHaveBeenCalledWith('123');
  });
});
