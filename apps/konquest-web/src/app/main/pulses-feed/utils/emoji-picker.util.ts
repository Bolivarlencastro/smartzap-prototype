import { effect, ElementRef, Signal } from '@angular/core';

export function initEmojiPicker(
  container: Signal<ElementRef<HTMLDivElement> | undefined>,
  onSelect: (emoji: string) => void,
): void {
  effect(() => {
    const el = container()?.nativeElement;
    if (!el || el.children.length > 0) return;

    const picker = document.createElement('emoji-picker');
    picker.addEventListener('emoji-click', (e) => {
      const emoji: string = (e as unknown as CustomEvent).detail?.unicode ?? '';
      onSelect(emoji);
    });
    el.appendChild(picker);
  });
}
