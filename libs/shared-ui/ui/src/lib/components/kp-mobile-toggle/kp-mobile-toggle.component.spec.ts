import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpMobileToggleComponent } from './kp-mobile-toggle.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

describe('KpMobileToggleComponent', () => {
  let component: KpMobileToggleComponent;
  let fixture: ComponentFixture<KpMobileToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpMobileToggleComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(KpMobileToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle', () => {
    const spy = jest.spyOn(component.toggleChange, 'emit');
    component.onToggle();
    expect(spy).toHaveBeenCalled();
  });
});
