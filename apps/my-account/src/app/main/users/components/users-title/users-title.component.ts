import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton, MatAnchor } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

const NEW_USER_ROUTE = '/users/new';

@Component({
  selector: 'app-users-title',
  templateUrl: './users-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatAnchor, RouterLink, TranslocoPipe],
})
export class UsersTitleComponent {
  @Output() dialogOpened: EventEmitter<any> = new EventEmitter();
  @Output() drawerToggled: EventEmitter<any> = new EventEmitter();

  @Input() currentRoute!: string;

  constructor(
    private acRoute: ActivatedRoute,
    private router: Router,
  ) {}

  navigateToNew() {
    this.router.navigate(['new'], { relativeTo: this.acRoute });
  }

  onOpenDialog(): void {
    this.dialogOpened.emit();
  }

  get newUserDisabled(): boolean {
    return this.currentRoute === NEW_USER_ROUTE;
  }
}
