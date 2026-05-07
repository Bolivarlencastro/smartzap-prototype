import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <app-layout>
    <router-outlet></router-outlet>
  </app-layout>`,
  styles: [
    `
      :host {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        width: 100%;
        height: 100%;
        min-width: 0;
      }
    `,
  ],
  standalone: false,
})
export class AppComponent {}
