import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { CORE_CONFIG, CoreConfig, KONQUEST_APP, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import { KpSafeUrlPipe } from '../../pipes';

const CHATBOT_SRC_MAP: Record<string, string> = {
  'fddf62f0-36dd-42eb-98b1-2be022429a54': 'https://www.chatbase.co/chatbot-iframe/EDUp9XhpZOAC75z1He8eb', // GO LEARNING
  '13968cd5-0881-46aa-9153-7067cc53e9ca': 'https://www.chatbase.co/chatbot-iframe/O9t1djKa2f8CjJCTMiNqW', // QUINTO ANDAR
};

const STANDARD_CHATBOT_SRC = 'https://www.chatbase.co/chatbot-iframe/LpBjvqOyYvJtUVnwMqSG1';

@Component({
  selector: 'kp-chatbot',
  imports: [CommonModule, MatMenu, MatMenuTrigger, MatIcon, MatButtonModule, TranslocoModule, KpSafeUrlPipe],
  template: `
    <div class="cursor-pointer flex flex-col justify-center items-center group">
      <a mat-icon-button class="opacity-60 group-hover:opacity-100" aria-label="help" [matMenuTriggerFor]="menu">
        <mat-icon>help_outline</mat-icon>
      </a>
      <span class="text-2xxs opacity-80 group-hover:opacity-100">{{ 'UI.GENERAL.HELP' | transloco }}</span>
    </div>

    <mat-menu #menu="matMenu" class="w-96 max-w-none bg-white">
      <iframe
        [src]="chatbotSrc$ | async | kpSafeUrl"
        width="100%"
        style="height: 50vh; min-height: 500px"
        frameborder="0"
      ></iframe>
    </mat-menu>
  `,
  styles: [
    `
      mat-icon {
        color: var(--kp-on-navigation-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpChatbotComponent {
  @ViewChild(MatMenuTrigger) private readonly menuTrigger?: MatMenuTrigger;

  chatbotSrc$: Observable<string>;

  constructor(
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
    private workspaceService: WorkspaceService,
  ) {
    this.setChatbotSrc();
  }

  private setChatbotSrc(): void {
    this.chatbotSrc$ = this.workspaceService.currentWorkspace$.pipe(
      map((workspace) => {
        if (this.coreConfig.appId === KONQUEST_APP.id) {
          return CHATBOT_SRC_MAP[workspace?.id] ?? STANDARD_CHATBOT_SRC;
        }

        return STANDARD_CHATBOT_SRC;
      }),
    );
  }

  @HostListener('window:kp-chatbot-open')
  openChatbot(): void {
    this.menuTrigger?.openMenu();
  }
}
