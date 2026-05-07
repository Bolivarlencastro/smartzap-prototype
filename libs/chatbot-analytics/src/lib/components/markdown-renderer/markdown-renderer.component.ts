import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'kp-markdown-renderer',
  template: `
    <div class="markdown-content prose prose-sm max-w-none dark:prose-invert" [innerHTML]="safeHtml()"></div>
  `,
  styles: [
    `
      .markdown-content {
        padding: 8px 14px;
        color: var(--mat-sys-on-surface-variant);
        line-height: 1.6;
      }

      .markdown-content *:first-child {
        margin-top: 0 !important;
      }
      .markdown-content *:last-child {
        margin-bottom: 0 !important;
      }

      .markdown-content table {
        overflow-x: auto;
        overflow-y: hidden;
        border-collapse: separate;
        border-spacing: 0;
        margin: 1.5rem 0;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 0.5rem;
        background: var(--mat-sys-surface);
      }

      .markdown-content th {
        background-color: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        font-weight: 600;
        text-align: left !important;
        padding: 12px 16px;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }

      .markdown-content td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        text-align: left !important;
        color: var(--mat-sys-on-surface-variant);
      }

      .markdown-content th:not(:last-child),
      .markdown-content td:not(:last-child) {
        border-right: 1px solid var(--mat-sys-outline-variant);
      }

      .markdown-content tr:hover {
        background-color: var(--mat-sys-surface-container-low);
      }

      .markdown-content p {
        margin-bottom: 1rem;
      }
      .markdown-content h1,
      .markdown-content h2,
      .markdown-content h3 {
        color: var(--mat-sys-on-surface);
        font-weight: 700;
        margin: 1.5rem 0 0.75rem;
      }

      .markdown-content a {
        color: var(--mat-sys-primary);
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s;
      }
      .markdown-content a:hover {
        opacity: 0.8;
        border-bottom: 1px solid currentColor;
      }

      .markdown-content blockquote {
        border-left: 4px solid var(--mat-sys-outline-variant);
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent {
  markdown = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);

  readonly safeHtml = computed(() => {
    const rawHtml = marked.parse(this.markdown()) as string;
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  });
}
