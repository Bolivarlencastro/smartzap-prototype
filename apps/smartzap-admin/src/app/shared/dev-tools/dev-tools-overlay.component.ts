import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { getCoursesListEdgeCases } from './edge-cases/courses-list.edge-cases';
import { getCourseEnrollmentsEdgeCases } from './edge-cases/course-enrollments.edge-cases';
import { getCourseFormEdgeCases } from './edge-cases/course-form.edge-cases';
import { getCourseFormInfoEdgeCases } from './edge-cases/course-form-info.edge-cases';
import { getUsersEdgeCases } from './edge-cases/users.edge-cases';
import { getSettingsEnrollmentsEdgeCases } from './edge-cases/settings-enrollments.edge-cases';

export interface EdgeCase {
  label: string;
  description: string;
  icon: string;
  apply: () => void;
}

export interface EdgeCaseGroup {
  title: string;
  cases: EdgeCase[];
}

function resolveEdgeCases(url: string, store: Store): EdgeCaseGroup[] {
  if (/^\/courses\/[^/]+\/enrollments/.test(url)) return getCourseEnrollmentsEdgeCases(store);
  if (/^\/courses\/[^/]+\/form\/contents/.test(url)) return getCourseFormEdgeCases(store);
  if (/^\/courses\/[^/]+\/form/.test(url)) return getCourseFormInfoEdgeCases(store);
  if (/^\/courses\/[^/]+/.test(url)) return [];
  if (/^\/courses/.test(url)) return getCoursesListEdgeCases(store);
  if (/^\/users/.test(url)) return getUsersEdgeCases(store);
  if (/^\/settings\/enrollments/.test(url)) return getSettingsEnrollmentsEdgeCases(store);
  return [];
}

@Component({
  selector: 'dev-tools-overlay',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dev-tools-host' },
  template: `
    <div
      class="dt-wrapper"
      [class.dt-wrapper--visible]="visible() || menuOpen()"
      (mouseenter)="menuOpen.set(true)"
      (mouseleave)="menuOpen.set(false)"
    >
      @if (menuOpen()) {
        <div class="dt-menu">
          <div class="dt-menu__header">
            <span class="dt-menu__label">Edge / Corner Cases</span>
            <code class="dt-menu__url">{{ currentUrl() }}</code>
          </div>

          @if (edgeCaseGroups().length === 0) {
            <p class="dt-menu__empty">Nenhum edge case registrado para esta página.</p>
          } @else {
            @for (group of edgeCaseGroups(); track group.title) {
              <div class="dt-group">
                <span class="dt-group__title">{{ group.title }}</span>
                @for (ec of group.cases; track ec.label) {
                  <button class="dt-item" (click)="apply(ec)">
                    <mat-icon class="dt-item__icon">{{ ec.icon }}</mat-icon>
                    <span class="dt-item__body">
                      <strong class="dt-item__name">{{ ec.label }}</strong>
                      <small class="dt-item__desc">{{ ec.description }}</small>
                    </span>
                  </button>
                }
              </div>
            }
          }
        </div>
      }

      <button class="dt-fab" (click)="toggleMenu()" title="Dev Tools — Edge Cases">
        <mat-icon>bug_report</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      :host.dev-tools-host {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        max-width: none;
        max-height: none;
        pointer-events: none;
      }

      .dt-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 160ms ease;
      }

      .dt-wrapper--visible {
        opacity: 1;
        pointer-events: auto;
      }

      .dt-fab {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #1e293b;
        color: #94a3b8;
        border: 1.5px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        transition:
          transform 150ms ease,
          background 150ms ease,
          color 150ms ease;
        padding: 0;
        flex-shrink: 0;
      }

      .dt-fab:hover {
        background: #334155;
        color: #fff;
        transform: scale(1.08);
      }

      .dt-menu {
        background: #0f172a;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
        width: 300px;
        max-height: 480px;
        overflow-y: auto;
        color: #e2e8f0;
        font-family: inherit;
        scrollbar-width: thin;
        scrollbar-color: #334155 transparent;
      }

      .dt-menu__header {
        padding: 12px 16px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        display: flex;
        flex-direction: column;
        gap: 2px;
        position: sticky;
        top: 0;
        background: #0f172a;
        z-index: 1;
      }

      .dt-menu__label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #64748b;
      }

      .dt-menu__url {
        font-size: 11px;
        color: #818cf8;
        font-family: monospace;
        word-break: break-all;
      }

      .dt-menu__empty {
        padding: 24px 16px;
        color: #475569;
        font-size: 13px;
        text-align: center;
        margin: 0;
      }

      .dt-group {
        padding: 6px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .dt-group:last-child {
        border-bottom: none;
      }

      .dt-group__title {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
        padding: 6px 16px 2px;
        display: block;
      }

      .dt-item {
        width: 100%;
        padding: 7px 16px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #e2e8f0;
        text-align: left;
        transition: background 120ms ease;
        font-family: inherit;
      }

      .dt-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .dt-item__icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        line-height: 18px !important;
        color: #64748b;
        flex-shrink: 0;
      }

      .dt-item__body {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .dt-item__name {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.3;
      }

      .dt-item__desc {
        font-size: 11px;
        color: #64748b;
        line-height: 1.3;
      }
    `,
  ],
})
export class DevToolsOverlayComponent implements OnInit {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  protected visible = signal(false);
  protected menuOpen = signal(false);
  protected currentUrl = signal('');
  protected edgeCaseGroups = signal<EdgeCaseGroup[]>([]);

  ngOnInit(): void {
    fromEvent<MouseEvent>(this.document, 'mousemove')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        const width = this.document.documentElement.clientWidth;
        const height = this.document.documentElement.clientHeight;
        const nearRightEdge = event.clientX > width - 96;
        const nearBottomEdge = event.clientY > height - 96;
        this.visible.set(nearRightEdge && nearBottomEdge);
      });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        const url = e.urlAfterRedirects;
        this.currentUrl.set(url);
        this.edgeCaseGroups.set(resolveEdgeCases(url, this.store));
        this.menuOpen.set(false);
      });

    const url = this.router.url;
    this.currentUrl.set(url);
    this.edgeCaseGroups.set(resolveEdgeCases(url, this.store));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected apply(ec: EdgeCase): void {
    ec.apply();
    this.menuOpen.set(false);
  }
}
