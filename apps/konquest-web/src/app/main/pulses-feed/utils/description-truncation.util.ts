import { afterRenderEffect, ElementRef, Signal, WritableSignal } from '@angular/core';

export function initDescriptionTruncation(
  descriptionEl: Signal<ElementRef<HTMLParagraphElement> | undefined>,
  isTruncated: WritableSignal<boolean>,
): void {
  afterRenderEffect((onCleanup) => {
    const el = descriptionEl()?.nativeElement;
    if (!el) return;

    const check = () => isTruncated.set(el.scrollHeight > el.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });
}
