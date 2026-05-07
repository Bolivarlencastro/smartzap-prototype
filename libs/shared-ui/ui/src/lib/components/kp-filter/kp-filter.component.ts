import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { KpGlobalSearchInputComponent } from '../kp-global-search-input';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { constants } from '../../constants';

@Component({
  selector: 'kp-filter',
  imports: [CommonModule, MatDividerModule, KpGlobalSearchInputComponent],
  templateUrl: './kp-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterComponent {
  readonly isMobile$: Observable<boolean>;

  @Input() currentSearchTerm: string;
  @Output() searchChange = new EventEmitter<string>();

  constructor(private _breakpointObserver: BreakpointObserver) {
    this.isMobile$ = _breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  searchTerm(term: string): void {
    this.searchChange.emit(term);
  }
}
