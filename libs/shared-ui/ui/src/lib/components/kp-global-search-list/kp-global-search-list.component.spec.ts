import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpGlobalSearchListComponent } from './kp-global-search-list.component';
import { ContentTypeTabs } from './model/global-search-list.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KpGlobalSearchListComponent', () => {
  let component: KpGlobalSearchListComponent;
  let fixture: ComponentFixture<KpGlobalSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [getTranslocoTestingModule(), KpGlobalSearchListComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KpGlobalSearchListComponent);
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

  it('should change the active tab and emit contentType event on changeTab()', async () => {
    const contentTypeSpy = jest.spyOn(component.contentType, 'emit');
    const newTab = ContentTypeTabs.CHANNELS;
    component.activeTab = ContentTypeTabs.MISSIONS;
    component.changeTab(newTab);

    await fixture.whenStable();
    expect(component.activeTab).toBe(newTab);
    expect(contentTypeSpy).toHaveBeenCalledWith(newTab);
  });

  it('should emit openContent event', () => {
    const item = { id: '123' };
    const emitSpy = jest.spyOn(component.openContent, 'emit');

    component.onOpenContent(item);
    expect(emitSpy).toHaveBeenCalledWith(item);
  });
});
