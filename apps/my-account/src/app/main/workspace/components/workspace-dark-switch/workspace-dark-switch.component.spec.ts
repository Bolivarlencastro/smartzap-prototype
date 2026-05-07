import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceDarkSwitchComponent } from './workspace-dark-switch.component';

describe('WorkspaceDarkSwitchComponent', () => {
  let component: WorkspaceDarkSwitchComponent;
  let fixture: ComponentFixture<WorkspaceDarkSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceDarkSwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceDarkSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
