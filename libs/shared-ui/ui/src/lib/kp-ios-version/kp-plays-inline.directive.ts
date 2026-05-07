import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Directive({
  selector: '[kpPlaysInline]',
  standalone: true,
})
export class KpPlaysInlineDirective implements OnInit {
  @Input() kpPlaysInline: string;

  constructor(
    private platform: Platform,
    private elementRef: ElementRef,
  ) {}

  get iOSVersion() {
    const agent = window?.navigator?.userAgent || '';
    const start = agent.indexOf(' OS ');
    if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
      return Number(agent.substring(start + 3, start + 6).replace('_', '.'));
    }
    return 0;
  }

  ngOnInit() {
    const isYouTube = this.kpPlaysInline?.includes('youtu');
    const isVimeoOnOldIOS = this.kpPlaysInline?.includes('vimeo') && this.platform.IOS && this.iOSVersion <= 17;

    if (isYouTube || isVimeoOnOldIOS) {
      this.elementRef.nativeElement['playsInline'] = true;
    }
  }
}
