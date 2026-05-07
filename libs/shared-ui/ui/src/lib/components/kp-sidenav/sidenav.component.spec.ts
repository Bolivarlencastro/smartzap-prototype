import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpSidenavItemComponent } from './kp-sidenav-item.component';
import { SidenavComponent } from './sidenav.component';
import { Component, signal, viewChild } from '@angular/core';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('showBackdrop', () => {
    it('should return true when type is over and the sideNav is open', () => {
      component.open.set(true);
      component.sideNavType.set('over');

      expect(component.showBackdrop()).toBe(true);
    });
  });

  describe('contentMarginLeft', () => {
    it('should return the sideNav width', () => {
      component.open.set(true);
      component.sidenavMode.set('full');

      expect(component.contentMarginLeft()).toBe(360);
    });

    it('should return the sideNav miniWidth when mode is mini', () => {
      component.open.set(true);
      component.sidenavMode.set('mini');

      expect(component.contentMarginLeft()).toBe(72);
    });

    it('should return 0 if the sideNav is closed', () => {
      component.open.set(false);

      expect(component.contentMarginLeft()).toBe(0);
    });
  });

  describe('sidenavLeft', () => {
    it('should return the sideNav left position', () => {
      component.open.set(false);
      component.sidenavMode.set('full');

      expect(component.sidenavLeft()).toBe(-360);
    });

    it('should return the sideNav left position when mode is mini', () => {
      component.open.set(false);
      component.sidenavMode.set('mini');

      expect(component.sidenavLeft()).toBe(-72);
    });

    it('should return 0 if the sideNav is open', () => {
      component.open.set(true);

      expect(component.sidenavLeft()).toBe(0);
    });
  });

  describe('toggle', () => {
    it('should toggle the sideMenu', () => {
      component.toggle();
      expect(component.open()).toBe(true);

      component.toggle();
      expect(component.open()).toBe(false);
    });
  });

  describe('setActiveItem', () => {
    describe('when toggling the currently active item', () => {
      it('should open the sidenav if the item is toggled with backdrop shown', () => {
        const mockItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
        const itemToggleSpy = jest.spyOn(mockItem, 'toggle');
        fixture.componentRef.setInput('open', false);
        component['lastActiveItem'] = mockItem;
        jest.spyOn(component, 'showBackdrop').mockReturnValue(true);

        component.setActiveItem(mockItem);

        expect(component.open()).toBe(true);
        expect(itemToggleSpy).toHaveBeenCalledWith(false);
      });

      it('should close the sidenav if the item is toggled without backdrop', () => {
        const mockItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
        const clearSpy = jest.spyOn(component.navContainer, 'clear').mockImplementation();
        const setSpy = jest.spyOn(component.sidenavMode, 'set').mockImplementation();
        component['lastActiveItem'] = mockItem;
        jest.spyOn(component, 'showBackdrop').mockReturnValue(false);

        component.setActiveItem(mockItem);

        expect(component['lastActiveItem']).toBeUndefined();
        expect(clearSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('mini');
      });

      describe('when toggling a new item', () => {
        it('should deactivate the last active item and clear the nav container if the new item is inactive', () => {
          const mockItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const mockLastItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const clearSpy = jest.spyOn(component.navContainer, 'clear').mockImplementation();
          const toggleSpy = jest.spyOn(mockLastItem, 'toggle').mockImplementation();
          component['lastActiveItem'] = mockLastItem;
          mockItem.active.set(false);

          component.setActiveItem(mockItem);

          expect(toggleSpy).toHaveBeenCalledWith(false);
          expect(clearSpy).toHaveBeenCalled();
          expect(component['lastActiveItem']).toBeUndefined();
        });

        it('should activate the new item and set sidenav mode to mini if it has no content', () => {
          const mockItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const mockLastItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const clearSpy = jest.spyOn(component.navContainer, 'clear').mockImplementation();
          const toggleSpy = jest.spyOn(mockLastItem, 'toggle').mockImplementation();
          const setSpy = jest.spyOn(component.sidenavMode, 'set').mockImplementation();
          jest.spyOn(mockItem, 'hasContent').mockReturnValue(false);
          component['lastActiveItem'] = mockLastItem;
          mockItem.active.set(true);

          component.setActiveItem(mockItem);

          expect(toggleSpy).toHaveBeenCalledWith(false);
          expect(clearSpy).toHaveBeenCalled();
          expect(setSpy).toHaveBeenCalledWith('mini');
          expect(component['lastActiveItem']).toEqual(mockItem);
        });

        it('should activate the new item and render its content if it has content', () => {
          const mockItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const mockLastItem = TestBed.createComponent(KpSidenavItemComponent).componentInstance;
          const clearSpy = jest.spyOn(component.navContainer, 'clear').mockImplementation();
          const toggleSpy = jest.spyOn(mockLastItem, 'toggle').mockImplementation();
          const setSpy = jest.spyOn(component.sidenavMode, 'set').mockImplementation();
          const createEmbeddedViewSpy = jest.spyOn(component.navContainer, 'createEmbeddedView').mockImplementation();
          jest.spyOn(mockItem, 'hasContent').mockReturnValue(true);
          component['lastActiveItem'] = mockLastItem;
          mockItem.active.set(true);

          component.setActiveItem(mockItem);

          expect(toggleSpy).toHaveBeenCalledWith(false);
          expect(clearSpy).toHaveBeenCalled();
          expect(setSpy).toHaveBeenCalledWith('full');
          expect(createEmbeddedViewSpy).toHaveBeenCalledWith(mockItem.templateRef);
          expect(component['lastActiveItem']).toEqual(mockItem);
        });
      });
    });
  });
});

describe('SidenavComponent active item index toggling', () => {
  let testComponent: TestHostComponent;
  let testFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SidenavComponent, KpSidenavItemComponent],
    }).compileComponents();

    testFixture = TestBed.createComponent(TestHostComponent);
    testComponent = testFixture.componentInstance;
    testFixture.detectChanges();
  });

  it('should toggle the active item', () => {
    const toggleSpy = jest.spyOn(testComponent.sideNavItem(), 'toggle');
    testComponent.activeItemIndex.set(0);
    testFixture.detectChanges();

    expect(toggleSpy).toHaveBeenCalled();
  });
});

@Component({
  selector: 'kp-test-host-component',
  imports: [SidenavComponent, KpSidenavItemComponent],
  template: `
    <kp-sidenav [activeItemIndex]="activeItemIndex()">
      <kp-sidenav-item></kp-sidenav-item>
    </kp-sidenav>
  `,
})
class TestHostComponent {
  activeItemIndex = signal<undefined | number>(undefined);
  sideNavItem = viewChild(KpSidenavItemComponent);
}
