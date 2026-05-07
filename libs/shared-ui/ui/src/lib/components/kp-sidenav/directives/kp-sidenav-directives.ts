import { Directive } from '@angular/core';

@Directive({
  selector: '[kpSidenavFooter]',
  standalone: true,
})
export class KpSidenavFooterDirective {}

@Directive({
  selector: '[kpSidenavContent]',
  standalone: true,
  host: {
    class: 'kp-sidenav-content',
  },
})
export class KpSidenavContentDirective {}
