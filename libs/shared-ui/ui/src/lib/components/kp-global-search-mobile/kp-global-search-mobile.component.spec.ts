import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemType } from '../kp-global-search-item';
import { ContentTypeTabs } from '../kp-global-search-list';
import { KpGlobalSearchMobileComponent } from './kp-global-search-mobile.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

const itemMock = {
  id: '1',
  enrolled: true,
  type: ItemType.COURSE,
  pulse_type: null,
};

describe('KpGlobalSearchMobileComponent', () => {
  let component: KpGlobalSearchMobileComponent;
  let fixture: ComponentFixture<KpGlobalSearchMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpGlobalSearchMobileComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(KpGlobalSearchMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return true for isActive when the tab is active', () => {
    const tab = ContentTypeTabs.MISSIONS;
    component.activeTab = tab;
    expect(component.isActive(tab)).toBe(true);
  });

  it('should return false for isActive when the tab is not active', () => {
    component.activeTab = ContentTypeTabs.MISSIONS;
    expect(component.isActive(ContentTypeTabs.CHANNELS)).toBe(false);
  });

  it('should change the active tab and emit contentType event on changeTab()', () => {
    const contentTypeSpy = jest.spyOn(component.contentType, 'emit');
    const newTab = ContentTypeTabs.CHANNELS;
    fixture.componentRef.setInput('activeTab', ContentTypeTabs.MISSIONS);
    fixture.detectChanges();

    component.changeTab(newTab);
    expect(component.activeTab).toBe(newTab);
    expect(contentTypeSpy).toHaveBeenCalledWith(newTab);
  });

  it('should open details', () => {
    const spy = jest.spyOn(component.openDetails, 'emit');
    component.onOpenDetails(itemMock);
    expect(spy).toHaveBeenCalledWith(itemMock);
  });

  it('should return the correct one by trackByFn', () => {
    const itemWithId = { id: 1, name: 'Item with ID' };
    const itemWithoutId = { name: 'Item without ID' };
    expect(component.trackByFn(0, itemWithId)).toBe(1);
    expect(component.trackByFn(0, itemWithoutId)).toBe(0);
  });

  it('should filter by term', () => {
    const spy = jest.spyOn(component.serchTerm, 'emit');
    const term = 'test';
    component.filterByTerm(term);
    expect(spy).toHaveBeenCalledWith(term);
  });

  it('should on scroll', () => {
    const spy = jest.spyOn(component.scrolled, 'emit');
    component.onScroll();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit openContent event', () => {
    const event = new Event('click');
    const emitSpy = jest.spyOn(component.openContent, 'emit');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    component.onOpenContent(itemMock, event);
    expect(emitSpy).toHaveBeenCalledWith(itemMock);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
