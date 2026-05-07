import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

marker('REPORT.STATUS.DONE');
marker('REPORT.STATUS.ERROR');
marker('REPORT.STATUS.QUEUED');
marker('REPORT.STATUS.PROCESSING');
marker('REPORT.STATUS.TIMEOUT');

export const REPORTS_STATUSES: Record<string, string> = {
  DONE: '#00CBAB',
  ERROR: '#d92b2b',
  QUEUED: '#6200EA',
  PROCESSING: '#FF724F',
  TIMEOUT: '#9E9E9E',
};

@Directive({ selector: '[reportStatus]' })
export class ReportStatusDirective implements OnInit {
  @Input() reportStatus = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.classList.add('text-white', 'rounded-full', 'px-4', 'py-1', 'text-xs');
    this.el.nativeElement.style.backgroundColor = REPORTS_STATUSES[this.reportStatus] || 'yellow';
  }
}
