import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNavComponent } from './header-nav.component';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';

describe('HeaderNavComponent', () => {
  let component: HeaderNavComponent;
  let fixture: ComponentFixture<HeaderNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNavComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the next and previous events', () => {
    const nextSpy = jest.spyOn(component.next, 'emit');
    const previousSpy = jest.spyOn(component.previous, 'emit');

    component.nextStep();
    component.previousStep();

    expect(nextSpy).toHaveBeenCalled();
    expect(previousSpy).toHaveBeenCalled();
  });
});
