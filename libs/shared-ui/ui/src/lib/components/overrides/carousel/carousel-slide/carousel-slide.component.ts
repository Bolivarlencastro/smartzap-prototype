import { ListKeyManagerOption } from '@angular/cdk/a11y';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { MatCarouselSlide } from './carousel-slide';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.scss'],
  standalone: true,
})
export class MatCarouselSlideComponent implements ListKeyManagerOption, MatCarouselSlide, OnInit {
  @Input() public image: SafeStyle | string;
  @Input() public overlayColor = '#00000050';
  @Input() public disableBackground = false;
  @Input() public hideOverlay = false;
  @Input() public disabled = false; // implements ListKeyManagerOption

  @ViewChild(TemplateRef) public templateRef: TemplateRef<any>;

  constructor(public sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    if (this.image) {
      if (typeof this.image === 'string') {
        this.image = this.sanitizer.bypassSecurityTrustStyle(`url("${this.image}")`);
      }
    } else if (!this.disableBackground) {
      this.image = 'url(https://assets.keepsdev.com/images/placeholders/v2/banner.png)';
    }
  }
}
