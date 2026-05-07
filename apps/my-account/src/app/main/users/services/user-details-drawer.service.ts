import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsDrawerService {
  private drawer: MatDrawer;

  constructor(private _router: Router) {}

  setDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }

  openDrawer() {
    this.drawer?.open();

    return this.drawer.openedChange.pipe(
      filter((isOpen) => !isOpen),
      take(1),
    );
  }

  closeDrawer() {
    this.drawer?.close();
    this.navigateToUsers();
  }

  navigateToUsers() {
    this._router.navigate(['/users']);
  }
}
