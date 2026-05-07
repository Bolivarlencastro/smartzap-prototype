import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BannerModel } from '../../models/banners';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent, NoopAnimationsModule],
      providers: [{ provide: UserProfileService, useValue: { isAdmin$: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit openSettings event', () => {
    const event = { stopPropagation: jest.fn() };
    const emitSpy = jest.spyOn(component.openSettings, 'emit');

    component.onOpenSettings(event as unknown as MouseEvent);

    expect(emitSpy).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  describe('onOpenDetails', () => {
    const cases: any[] = [['COURSE'], ['LEARNING_TRAIL'], ['EVENT']];

    test.each(cases)('should emit action event for this resource_type: %p', (resource_type) => {
      const item = { id: '123', resource_type } as BannerModel;
      const emitSpy = jest.spyOn(component.action, 'emit');

      component.onOpenDetails(item);

      expect(emitSpy).toHaveBeenCalledWith({ item, action: 'details' });
    });

    it('should not emit action event when resource_type is EXTERNAL_CONTENT', () => {
      const item = { id: '123', resource_type: 'EXTERNAL_CONTENT' } as BannerModel;
      const emitSpy = jest.spyOn(component.action, 'emit');

      component.onOpenDetails(item);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  it('should emit action event when clicking the banner button', () => {
    const event = { stopPropagation: jest.fn() };
    const item = { id: '123', action: 'view-more' } as BannerModel;
    const emitSpy = jest.spyOn(component.action, 'emit');

    component.onAction(item, event as unknown as MouseEvent);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith({ item, action: item.action });
  });
});
