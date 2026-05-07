import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContentComponent } from './content.component';
import { ContentRouterModule } from './content.router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KpQuizComponent, KpQuizService } from '@keeps-platform-frontend-workspace/ui/kp-quiz';
import { KpViewerComponent } from '@keeps-platform-frontend-workspace/ui/kp-viewer';

@NgModule({
  declarations: [ContentComponent],
  providers: [KpQuizService],
  imports: [
    // Angular
    CommonModule,
    ContentRouterModule,

    // Keeps Components
    MatButtonModule,
    MatIconModule,
    KpQuizComponent,
    KpViewerComponent,
  ],
})
export class ContentModule {}
