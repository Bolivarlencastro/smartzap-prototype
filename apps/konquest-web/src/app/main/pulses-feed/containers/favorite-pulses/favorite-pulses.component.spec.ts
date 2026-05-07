jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { FavoritePulsesComponent } from './favorite-pulses.component';
import { feedFeature } from '../../store';
import { FavoritePulsesViewModel } from '../../models/view-models';

const mockItems = [
  { id: '1', name: 'Pulse 1', cover_image: null },
  { id: '2', name: 'Pulse 2', cover_image: null },
  { id: '3', name: 'Pulse 3', cover_image: null },
  { id: '4', name: 'Pulse 4', cover_image: null },
  { id: '5', name: 'Pulse 5', cover_image: null },
];

const mockVm: FavoritePulsesViewModel = {
  loading: false,
  items: mockItems,
};

describe('FavoritePulsesComponent', () => {
  let component: FavoritePulsesComponent;
  let fixture: ComponentFixture<FavoritePulsesComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritePulsesComponent, getTranslocoTestingModule()],
      providers: [provideMockStore(), { provide: Router, useValue: { navigateByUrl: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    store.overrideSelector(feedFeature.selectFavoritePulsesViewModel, mockVm);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePulsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('visibleItems', () => {
    it('should show max 4 items by default', () => {
      const items = fixture.nativeElement.querySelectorAll('.item');
      expect(items.length).toBe(4);
    });

    it('should show all items after toggleShowAll', () => {
      component.toggleShowAll();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('.item');
      expect(items.length).toBe(5);
    });

    it('should return to max 4 when toggled back', () => {
      component.toggleShowAll();
      component.toggleShowAll();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('.item');
      expect(items.length).toBe(4);
    });
  });

  describe('showAll signal', () => {
    it('should start with toggle button showing "show all" state', () => {
      const toggleBtn = fixture.nativeElement.querySelector('.toggle-btn');
      expect(toggleBtn).toBeTruthy();
      const icon = toggleBtn.querySelector('mat-icon');
      expect(icon.textContent.trim()).toBe('expand_more');
    });

    it('should switch to "show less" state after toggleShowAll', () => {
      component.toggleShowAll();
      fixture.detectChanges();
      const toggleBtn = fixture.nativeElement.querySelector('.toggle-btn');
      const icon = toggleBtn.querySelector('mat-icon');
      expect(icon.textContent.trim()).toBe('expand_less');
    });
  });

  describe('onOpenPulse', () => {
    it('should navigate to the pulse detail route', () => {
      component.onOpenPulse('pulse-1');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/P/pulse-1');
    });
  });
});
