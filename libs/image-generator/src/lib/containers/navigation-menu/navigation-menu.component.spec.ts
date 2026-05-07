import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationMenuComponent } from './navigation-menu.component';
import { ImageWizardService } from '../../services/image-wizard.service';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { signal } from '@angular/core';

describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;
  let imageWizardMock: jest.Mocked<ImageWizardService>;

  beforeEach(async () => {
    imageWizardMock = {
      setType: jest.fn(),
      wizardType: signal('FILE_UPLOAD'),
    } as unknown as jest.Mocked<ImageWizardService>;

    await TestBed.configureTestingModule({
      imports: [NavigationMenuComponent, getTranslocoTestingModule()],
      providers: [{ provide: ImageWizardService, useValue: imageWizardMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the wizardType', () => {
    component.setWizardType('AI_IMAGE_GEN');

    expect(imageWizardMock.setType).toHaveBeenCalledWith('AI_IMAGE_GEN');
  });
});
