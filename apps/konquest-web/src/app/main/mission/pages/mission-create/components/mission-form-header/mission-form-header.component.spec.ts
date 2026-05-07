import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionFormHeaderComponent } from './mission-form-header.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('FormHeaderComponent', () => {
  let component: MissionFormHeaderComponent;
  let fixture: ComponentFixture<MissionFormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionFormHeaderComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionFormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit previous event', () => {
    const previousSpy = jest.spyOn(component.previous, 'emit');

    component.onPreviousClick();

    expect(previousSpy).toHaveBeenCalled();
  });

  it('should emit next event', () => {
    const nextSpy = jest.spyOn(component.next, 'emit');

    component.onNextClick();

    expect(nextSpy).toHaveBeenCalled();
  });
});
