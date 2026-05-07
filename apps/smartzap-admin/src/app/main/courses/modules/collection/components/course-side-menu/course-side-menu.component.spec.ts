import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CourseSideMenuComponent } from './course-side-menu.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('CourseSideMenuComponent', () => {
  let component: CourseSideMenuComponent;
  let fixture: ComponentFixture<CourseSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CourseSideMenuComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close side menu', () => {
    const spy = jest.spyOn(component.closeMenu, 'emit');
    const closeButton = fixture.debugElement.query(By.css('button')).nativeElement;
    closeButton.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
