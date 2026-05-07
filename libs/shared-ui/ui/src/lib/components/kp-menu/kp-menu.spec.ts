import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpMenuComponent } from './kp-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KpMenuApp } from './kp-menu-app';

describe('KpMenuComponent', () => {
  let component: KpMenuComponent;
  let fixture: ComponentFixture<KpMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpMenuComponent, MatMenuModule, MatIconModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KpMenuComponent);
    component = fixture.componentInstance;
  });

  describe('getAppHref()', () => {
    it('should return app URL concatenated with workspaceBaseHref if app id is not GAME_UP_ID', () => {
      fixture.componentRef.setInput('workspaceBaseHref', '/base/');
      const app: KpMenuApp = {
        id: '1',
        icon: 'icon',
        name: 'name',
        url: '/url/',
      };
      const href = component.getAppHref(app);
      expect(href).toBe('/url//base/');
    });

    it('should return app URL directly if app id is GAME_UP_ID', () => {
      const app: KpMenuApp = {
        id: '85d8e4b9-9582-4c98-926d-9322e40896db',
        icon: 'icon',
        name: 'name',
        url: '/url/',
      };
      const href = component.getAppHref(app);
      expect(href).toBe('/url/');
    });

    it('should return app URL directly if workspaceBaseHref is not set', () => {
      const app: KpMenuApp = {
        id: '2',
        icon: 'icon',
        name: 'name',
        url: '/url/',
      };
      const href = component.getAppHref(app);
      expect(href).toBe('/url/');
    });
  });
});
