import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-teams-instructions-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatButton, MatDialogActions, MatDialogClose, TranslocoPipe],
  template: `
    <div mat-dialog-title>
      <h1 class="mb-1">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.TITLE' | transloco }}</h1>
      <h2 class="text-sm mb-3">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.SUB_TITLE' | transloco }}</h2>
    </div>
    <mat-dialog-content>
      <div class="instructions">
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">1</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_1.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_1.INFO' | transloco }}</p>
            <a matButton="filled" class="mt-2" [href]="TEAMS_BOT_DOWNLOAD_LINK" download target="_blank">{{
              'INTEGRATIONS.TEAMS_INSTRUCTIONS.BUTTON_DOWNLOAD_ZIP' | transloco
            }}</a>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">2</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_2.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_2.INFO' | transloco }}</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">3</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_3.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_3.INFO' | transloco }}</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">4</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_4.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_4.INFO_1' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_4.INFO_2' | transloco }}</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">5</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_5.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_5.INFO' | transloco }}</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">6</div>
            <div class="step-counter-line"></div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_6.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_6.INFO' | transloco }}</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="flex flex-col items-center">
            <div class="step-counter">7</div>
          </div>
          <div class="step-content">
            <p class="font-bold">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_7.TITLE' | transloco }}</p>
            <p class="step-info">{{ 'INTEGRATIONS.TEAMS_INSTRUCTIONS.STEP_7.INFO' | transloco }}</p>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions [align]="'end'">
      <button matButton mat-dialog-close>{{ 'GENERAL.CLOSE' | transloco }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .instructions {
      display: flex;
      flex-direction: column;
    }

    .instruction-step {
      display: flex;
      gap: 1rem;

      .step-content {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-bottom: 1.5rem;
      }

      .step-info {
        color: color-mix(in srgb, var(--mat-sys-on-surface-variant) 80%, transparent);
      }
    }

    .step-counter {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      place-items: center;
      width: 2.2rem;
      height: 2.2rem;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 50%;
      line-height: 1;
      border: 2px solid var(--mat-sys-outline);
      background-color: var(--mat-sys-surface-container-highest);
      color: var(--mat-sys-on-surface-variant);
    }

    .step-counter-line {
      flex: 1 1 0;
      width: 1px;
      background-color: var(--mat-sys-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsInstructionsDialogComponent {
  protected TEAMS_BOT_DOWNLOAD_LINK = 'https://assets.keepsdev.com/bots/konquest-teams-bot.zip';
}
