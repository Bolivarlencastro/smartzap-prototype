import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-tools-hub-list',
  imports: [TranslocoModule, MatTableModule, MatIconModule, MatButtonModule, NgxSkeletonLoaderModule],
  template: `
    @if (loading()) {
      <ngx-skeleton-loader animation="pulse" [theme]="headerLoaderTheme"></ngx-skeleton-loader>
      <ngx-skeleton-loader count="3" animation="pulse" [theme]="itemsLoaderTheme"></ngx-skeleton-loader>
    } @else {
      @if (items()?.length) {
        <mat-table [dataSource]="items()" class="kp-card-table max-h-[calc(100vh-193px)] overflow-y-auto">
          <ng-container matColumnDef="icon">
            <mat-header-cell *matHeaderCellDef class="font-bold min-w-[75px] max-w-[75px] justify-center">
              {{ 'TOOLS_HUB.ICON' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-[75px] max-w-[75px] justify-center">
              <mat-icon>{{ element?.icon }}</mat-icon>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef class="font-bold max-w-[300px]">
              {{ 'GENERAL.NAME' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="max-w-[300px]">
              <span class="line-clamp-3">
                {{ element?.name }}
              </span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="url">
            <mat-header-cell *matHeaderCellDef class="font-bold"> URL </mat-header-cell>
            <mat-cell *matCellDef="let element">
              <span class="line-clamp-3">
                {{ element?.url }}
              </span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="menu">
            <mat-header-cell *matHeaderCellDef class="font-bold min-w-[100px] max-w-[100px] justify-center">
              {{ 'TOOLS_HUB.MENU' | transloco }}
            </mat-header-cell>
            <mat-cell
              *matCellDef="let element"
              class="min-w-[100px] max-w-[100px] flex items-center justify-center gap-0.5"
            >
              <button mat-icon-button (click)="onEdit(element)">
                <mat-icon class="s-6">edit</mat-icon>
              </button>

              <button mat-icon-button (click)="onRemove(element?.id)">
                <mat-icon class="s-6">delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns" class="h-[72px]"></mat-row>
        </mat-table>
      } @else {
        <div class="mt-8 text-center text-sm">{{ 'TOOLS_HUB.EMPTY_LIST_MESSAGE' | transloco }}</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsHubListComponent {
  items = input<CustomMenuItem[]>();
  loading = input<boolean>();

  edit = output<CustomMenuItem>();
  remove = output<string>();

  private readonly baseLoaderTheme = { width: '100%', borderRadius: '0' };
  protected readonly headerLoaderTheme = { ...this.baseLoaderTheme, height: '48px' };
  protected readonly itemsLoaderTheme = { ...this.baseLoaderTheme, height: '74px' };
  protected readonly displayedColumns: string[] = ['icon', 'name', 'url', 'menu'];

  onEdit(item: CustomMenuItem) {
    this.edit.emit(item);
  }

  onRemove(id: string) {
    this.remove.emit(id);
  }
}
