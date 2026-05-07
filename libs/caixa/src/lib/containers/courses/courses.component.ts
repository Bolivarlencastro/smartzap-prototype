import { Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SideSectionComponent } from '../../components/side-section/side-section.component';
import { CourseListFacade } from '../../facades/course-list.facade';
import { CardAction, CoursesListViewModel } from '../../models';
import { CourseListComponent } from '../../components/course-list/course-list.component';
import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { UserLoginFacade } from '../../facades/user-login.facade';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

@Component({
  selector: 'cx-courses',
  imports: [SideSectionComponent, SearchBarComponent, CourseListComponent],
  template: `
    @let vm = viewModel();
    <cx-side-section [currentUser]="currentUser()" (login)="openLoginDialog()"></cx-side-section>
    <main class="content-wrapper">
      <cx-search-bar (filter)="onFilter($event)" [categories]="vm.categories"></cx-search-bar>
      <cx-course-list [courses]="courses()" [loading]="vm.loading" (action)="onCardAction($event)"></cx-course-list>
    </main>
  `,
  styles: `
    :host {
      display: grid;
      position: relative;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: 1rem;
      min-height: 100dvh;
      padding: 1rem calc(1rem + env(safe-area-inset-right)) 1rem calc(1rem + env(safe-area-inset-left));

      &:before {
        content: '';
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        background-image: url('/assets/images/background-cvp.png');
        background-size: cover;
        background-position: top center;
      }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 960px) {
      :host {
        grid-template-rows: 1fr;

        &:before {
          margin-left: 300px;
          width: calc(100vw - 300px);
        }
      }

      cx-side-section {
        position: fixed;
        inset: 0;
        width: 300px;
      }

      .content-wrapper {
        margin-left: 300px;
      }
    }
  `,
})
export class CoursesComponent {
  protected readonly viewModel: Signal<CoursesListViewModel>;
  protected readonly currentUser: Signal<CaixaSmartZapUser>;
  protected readonly courses: Signal<LearnContentCardData[]>;

  constructor(
    private readonly facade: CourseListFacade,
    private readonly loginFacade: UserLoginFacade,
    readonly route: ActivatedRoute,
  ) {
    this.facade.init(route);
    this.loginFacade.checkUserLogin();
    this.viewModel = this.facade.viewModel;
    this.currentUser = this.loginFacade.currentUser;
    this.courses = this.facade.courses;
  }

  onFilter(filter: { search: string; category_id: string }) {
    this.facade.filterCourses({ search: filter.search, category_id: filter.category_id });
  }

  onCardAction(action: CardAction) {
    this.facade.dispatchAction(action);
  }

  openLoginDialog() {
    this.loginFacade.openLoginDialog();
  }
}
