import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KonquestFeaturesService } from '@app/shared/services';
import { COURSES_SERVICE_ID, EVENTS_SERVICE_ID, HIGHLIGHTS_SERVICE_ID, TRAILS_SERVICE_ID } from '../models/home';

const SERVICE_HIERARCHY = [
  { slug: 'highlights', id: HIGHLIGHTS_SERVICE_ID },
  { slug: 'learning-trails', id: TRAILS_SERVICE_ID },
  { slug: 'courses', id: COURSES_SERVICE_ID },
  { slug: 'events', id: EVENTS_SERVICE_ID },
];

@Injectable({ providedIn: 'root' })
export class HomeResolver {
  constructor(
    private readonly router: Router,
    private readonly konquestFeatureServices: KonquestFeaturesService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!state.url.startsWith('/home')) {
      return;
    }

    const currentFilter = route.queryParams['filter'];

    if (currentFilter && this.isServiceActive(currentFilter)) {
      return;
    }

    const firstActiveServiceSlug = this.getFirstActiveServiceSlug();

    if (!firstActiveServiceSlug) {
      return;
    }

    this.router.navigate(['/home'], {
      queryParams: { filter: firstActiveServiceSlug },
      replaceUrl: true,
    });
  }

  private getFirstActiveServiceSlug(): string | null {
    const activeService = SERVICE_HIERARCHY.find((service) => this.konquestFeatureServices.isServiceActive(service.id));

    return activeService?.slug ?? null;
  }

  private isServiceActive(serviceSlug: string): boolean {
    const service = SERVICE_HIERARCHY.find((entry) => entry.slug === serviceSlug);
    return service ? this.konquestFeatureServices.isServiceActive(service.id) : false;
  }
}
