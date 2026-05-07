import { ChangeDetectionStrategy, Component, computed, input, output, Signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SECTION_CONTENT_TYPE } from '@app/main/section-contents/models/section-contents-type';
import { TranslocoModule } from '@jsverse/transloco';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentActionData, LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HomeSection, HomeSectionEmptyState, SECTION_EMPTY_STATE } from '../../models/home';

@Component({
  selector: 'app-section-carousel',
  imports: [CarouselModule, MatButtonModule, MatIconModule, TranslocoModule, KpLearnContentCardComponent, RouterLink],
  templateUrl: './section-carousel.component.html',
  styles: [
    `
      .empty-state-container {
        @apply h-72 w-full rounded-lg flex flex-col justify-center items-center px-4 opacity-75;

        border: 2px dashed var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-surface-container-lowest);

        .icon {
          @apply mb-2;

          font-size: 48px;
          width: 48px;
          height: 48px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionCarouselComponent {
  section = input<HomeSection>();
  isMobile = input<boolean>();
  cardAction = output<LearnContentActionData>();

  @ViewChild(CarouselComponent) owlCar: CarouselComponent;

  protected readonly isLearningTrailSection = computed(
    () => this.section()?.sectionContentType === SECTION_CONTENT_TYPE.TRAILS,
  );
  protected readonly emptyState: Signal<HomeSectionEmptyState | null> = computed(() => this.verifyEmptyState());
  protected readonly cardOrientation = computed(() => (this.isLearningTrailSection() ? 'landscape' : 'portrait'));
  protected readonly carouselItemWidth = computed(() => this.generateCarouselItemWidth());
  protected readonly customOptions: OwlOptions = {
    margin: 20,
    autoWidth: true,
    nav: false,
    dots: false,
  };
  protected isDragging = false;

  next() {
    this.owlCar.next();
  }

  prev() {
    this.owlCar.prev();
  }

  onCardAction(action: LearnContentCardActionId, cardData: LearnContentCardData) {
    if (this.isDragging) {
      return;
    }

    this.cardAction.emit({
      action,
      learnContent: cardData,
      contentType: this.isLearningTrailSection() ? 'trail' : 'mission',
    });
  }

  onDrag(dragging: boolean) {
    setTimeout(() => (this.isDragging = dragging), 0);
  }

  private verifyEmptyState(): HomeSectionEmptyState | null {
    if (this.section()?.contents?.length) {
      return null;
    }

    return SECTION_EMPTY_STATE[this.section()?.learning_object_type] || null;
  }

  private generateCarouselItemWidth(): number {
    if (this.isMobile()) {
      return this.isLearningTrailSection() ? 335 : 162;
    }

    return this.isLearningTrailSection() ? 409 : 240;
  }
}
