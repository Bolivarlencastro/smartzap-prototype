import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { InvalidRowModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'pm-invalid-rows-table',
  imports: [TranslocoPipe, ScrollingModule, KpPluralizeTranslatePipe],
  template: `
    <div class="table-header">
      <span class="text-xs font-bold"> {{ 'PUSH_MANAGER.CREATION.CONTACTS.INVALID_ROWS.TITLE' | transloco }}: </span>
      <span class="text-xs text-red-500 font-bold">
        {{ rows().length }}
        {{ 'PUSH_MANAGER.CREATION.CONTACTS.INVALID_ROWS.RECORD' | kpPluralizeTranslate: { value: rows().length } }}
      </span>
    </div>

    <div class="col-labels">
      <span class="col-name text-xs font-bold opacity-50">
        {{ 'PUSH_MANAGER.CREATION.CONTACTS.INVALID_ROWS.NAME' | transloco }}
      </span>
      <span class="col-phone text-xs font-bold opacity-50">
        {{ 'PUSH_MANAGER.CREATION.CONTACTS.INVALID_ROWS.PHONE' | transloco }}
      </span>
      <span class="col-row text-xs font-bold opacity-50">
        {{ 'PUSH_MANAGER.CREATION.CONTACTS.INVALID_ROWS.LINE' | transloco }}
      </span>
    </div>

    <cdk-virtual-scroll-viewport itemSize="52" class="rows-viewport">
      <div *cdkVirtualFor="let row of rows()" class="table-row">
        <span class="col-name text-sm">{{ row.name || '-' }}</span>
        <span class="col-phone text-xs">{{ row.phone || '-' }}</span>
        <span class="col-row text-xs font-bold">{{ row.row ?? '-' }}</span>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl overflow-hidden;
        height: 350px;
      }

      .table-header {
        @apply flex items-center flex-shrink-0 px-4 border-b border-default gap-1;
        height: 56px;
        background-color: var(--mat-sys-surface-container);
      }

      .col-labels,
      .table-row {
        display: flex !important;
        align-items: center !important;
      }

      .col-labels {
        @apply border-b border-default flex-shrink-0;
        height: 52px;
      }

      .rows-viewport {
        height: calc(350px - 56px - 52px);

        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, currentColor 20%, transparent);
          border-radius: 4px;
        }
      }

      .table-row {
        @apply w-full border-b border-default;
        width: 100%;
        height: 52px;
      }

      .col-name,
      .col-phone {
        @apply px-4 line-clamp-2;
        flex: 1;
        min-width: 0;
        word-break: break-word;
      }

      .col-row {
        @apply px-4 line-clamp-2;
        width: 68px;
        flex-shrink: 0;
        word-break: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmInvalidRowsTableComponent {
  rows = input.required<InvalidRowModel[]>();
}
