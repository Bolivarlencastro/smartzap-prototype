import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpInfiniteScrollContainerComponent } from './kp-infinite-scroll-container.component';
import { By } from '@angular/platform-browser';

describe('KpInfiniteScrollContainerComponent', () => {
  let component: KpInfiniteScrollContainerComponent;
  let fixture: ComponentFixture<KpInfiniteScrollContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpInfiniteScrollContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpInfiniteScrollContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should coerce the hostHeight property value', () => {
    fixture.componentRef.setInput('hostHeight', 200);
    fixture.detectChanges();

    const containerDiv = fixture.debugElement.query(By.css('div'));
    expect(containerDiv.nativeElement.style.height).toBe('200px');
  });

  it('should emit on scroll event', () => {
    const emitSpy = jest.spyOn(component.scrolled, 'emit');

    component.onScroll();

    expect(emitSpy).toHaveBeenCalled();
  });
});
