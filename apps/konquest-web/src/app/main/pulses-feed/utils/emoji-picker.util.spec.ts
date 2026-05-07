import { ElementRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { initEmojiPicker } from './emoji-picker.util';

describe('initEmojiPicker', () => {
  let onSelect: jest.Mock;

  beforeEach(() => {
    onSelect = jest.fn();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function run(containerSignal: ReturnType<typeof signal<ElementRef<HTMLDivElement> | undefined>>) {
    TestBed.runInInjectionContext(() => initEmojiPicker(containerSignal, onSelect));
    TestBed.flushEffects();
  }

  it('does nothing when container signal is undefined', () => {
    const container = signal<ElementRef<HTMLDivElement> | undefined>(undefined);
    run(container);

    expect(document.querySelectorAll('emoji-picker')).toHaveLength(0);
  });

  it('appends an emoji-picker element to an empty container', () => {
    const div = document.createElement('div');
    const container = signal<ElementRef<HTMLDivElement> | undefined>(new ElementRef(div));
    run(container);

    expect(div.children).toHaveLength(1);
    expect(div.children[0].tagName.toLowerCase()).toBe('emoji-picker');
  });

  it('does not append a second emoji-picker when the container already has children', () => {
    const div = document.createElement('div');
    div.appendChild(document.createElement('span'));
    const container = signal<ElementRef<HTMLDivElement> | undefined>(new ElementRef(div));
    run(container);

    expect(div.children).toHaveLength(1);
    expect(div.children[0].tagName.toLowerCase()).toBe('span');
  });

  it('calls onSelect with the unicode emoji when emoji-click fires', () => {
    const div = document.createElement('div');
    const container = signal<ElementRef<HTMLDivElement> | undefined>(new ElementRef(div));
    run(container);

    const picker = div.children[0];
    picker.dispatchEvent(new CustomEvent('emoji-click', { detail: { unicode: '😀' } }));

    expect(onSelect).toHaveBeenCalledWith('😀');
  });

  it('calls onSelect with an empty string when detail.unicode is missing', () => {
    const div = document.createElement('div');
    const container = signal<ElementRef<HTMLDivElement> | undefined>(new ElementRef(div));
    run(container);

    const picker = div.children[0];
    picker.dispatchEvent(new CustomEvent('emoji-click', { detail: {} }));

    expect(onSelect).toHaveBeenCalledWith('');
  });

  it('calls onSelect with an empty string when event detail is null', () => {
    const div = document.createElement('div');
    const container = signal<ElementRef<HTMLDivElement> | undefined>(new ElementRef(div));
    run(container);

    const picker = div.children[0];
    picker.dispatchEvent(new CustomEvent('emoji-click', { detail: null }));

    expect(onSelect).toHaveBeenCalledWith('');
  });
});
