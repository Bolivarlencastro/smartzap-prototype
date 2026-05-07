import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { LayoutComponent } from './layout.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
})
export class LayoutModule {
  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    const whatsAppIconUrl = domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/whatsapp.svg');
    const chatIconUrl = domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/chat.svg');
    iconRegistry.addSvgIcon('whatsapp', whatsAppIconUrl);
    iconRegistry.addSvgIcon('chat', chatIconUrl);
  }
}
