import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Content } from '@core/model';
import { ContentService } from '@core/services';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ContentResolver {
  constructor(
    private router: Router,
    private _smartzapService: ContentService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Content> | null {
    const { id } = route.params;
    const returnPhone = route.queryParamMap.get('phone');

    if (!id) {
      this.router.navigate(['/not-found'], { queryParams: returnPhone ? { phone: returnPhone } : undefined });
      return null;
    }

    return this._smartzapService.fetchContent(id).pipe(
      map((response) => ({ id, ...response })),
      catchError((error) => {
        this.router.navigate(['/not-found'], { queryParams: returnPhone ? { phone: returnPhone } : undefined });
        return throwError(() => error);
      }),
    );
  }
}
