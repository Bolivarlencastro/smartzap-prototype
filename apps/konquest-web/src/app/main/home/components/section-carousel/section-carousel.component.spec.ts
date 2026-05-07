import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SECTION_CONTENT_TYPE } from '@app/main/section-contents/models/section-contents-type';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { SectionCarouselComponent } from './section-carousel.component';

describe('SectionCarouselComponent', () => {
  let component: SectionCarouselComponent;
  let fixture: ComponentFixture<SectionCarouselComponent>;

  beforeEach(async () => {
    const mockCarousel = {
      next: jest.fn(),
      prev: jest.fn(),
    } as unknown as CarouselComponent;

    await TestBed.configureTestingModule({
      imports: [SectionCarouselComponent, getTranslocoTestingModule()],
      providers: [provideRouter([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionCarouselComponent);
    component = fixture.componentInstance;
    component.owlCar = mockCarousel;
    fixture.componentRef.setInput('section', { learningObjectType: null });

    fixture.detectChanges();
  });

  describe('Carousel navigation', () => {
    it('should call next() on owlCar', () => {
      const nextSpy = jest.spyOn(component.owlCar, 'next');
      component.next();
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should call prev() on owlCar', () => {
      const prevSpy = jest.spyOn(component.owlCar, 'prev');
      component.prev();
      expect(prevSpy).toHaveBeenCalled();
    });
  });

  it('should emit cardAction event with', () => {
    const action: LearnContentCardActionId = 'details';
    const emitSpy = jest.spyOn(component.cardAction, 'emit');
    const data = { sectionContentType: SECTION_CONTENT_TYPE.TRAILS };

    fixture.componentRef.setInput('section', data);

    component.onCardAction(action, null);

    expect(emitSpy).toHaveBeenCalledWith({
      action,
      learnContent: null,
      contentType: 'trail',
    });
  });
});
