import { ElementRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { initDescriptionTruncation } from './description-truncation.util';

describe('initDescriptionTruncation', () => {
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;
  let resizeCallback: ResizeObserverCallback;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();

    global.ResizeObserver = jest.fn((cb) => {
      resizeCallback = cb;
      return { observe: observeMock, disconnect: disconnectMock, unobserve: jest.fn() };
    }) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function run(
    descriptionEl: ReturnType<typeof signal<ElementRef<HTMLParagraphElement> | undefined>>,
    isTruncated: ReturnType<typeof signal<boolean>>,
  ) {
    TestBed.runInInjectionContext(() => initDescriptionTruncation(descriptionEl, isTruncated));
    TestBed.flushEffects();
  }

  it('does nothing when the element signal is undefined', () => {
    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(undefined);
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);

    expect(observeMock).not.toHaveBeenCalled();
    expect(isTruncated()).toBe(false);
  });

  it('sets isTruncated to false when scrollHeight <= clientHeight', () => {
    const el = document.createElement('p');
    Object.defineProperty(el, 'scrollHeight', { value: 50, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(new ElementRef(el));
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);

    expect(isTruncated()).toBe(false);
  });

  it('sets isTruncated to true when scrollHeight > clientHeight', () => {
    const el = document.createElement('p');
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(new ElementRef(el));
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);

    expect(isTruncated()).toBe(true);
  });

  it('observes the element with ResizeObserver', () => {
    const el = document.createElement('p');
    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(new ElementRef(el));
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);

    expect(observeMock).toHaveBeenCalledWith(el);
  });

  it('updates isTruncated when ResizeObserver fires', () => {
    const el = document.createElement('p');
    Object.defineProperty(el, 'scrollHeight', { value: 50, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(new ElementRef(el));
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);
    expect(isTruncated()).toBe(false);

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    resizeCallback([], {} as ResizeObserver);

    expect(isTruncated()).toBe(true);
  });

  it('disconnects the ResizeObserver on cleanup', () => {
    const el = document.createElement('p');
    const descriptionEl = signal<ElementRef<HTMLParagraphElement> | undefined>(new ElementRef(el));
    const isTruncated = signal(false);

    run(descriptionEl, isTruncated);

    TestBed.resetTestingModule();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
