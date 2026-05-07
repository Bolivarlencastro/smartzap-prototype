import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export abstract class BaseFacade {
  constructor(protected store: Store) {}

  protected select<T>(selector: (state: unknown) => T): Observable<T> {
    return this.store.select(selector);
  }
}
