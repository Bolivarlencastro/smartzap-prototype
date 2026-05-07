import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { constants } from '../../constants';
import { KpWorkspaceCardComponent } from './kp-workspace-card.component';

describe('KpWorkspaceCardComponent', () => {
  let component: KpWorkspaceCardComponent;
  let fixture: ComponentFixture<KpWorkspaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpWorkspaceCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpWorkspaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit workspaceSelected event', () => {
    const selecteSpy = jest.spyOn(component.workspaceSelected, 'emit');

    component.cardClicked();

    expect(selecteSpy).toHaveBeenCalled();
  });

  it('should display the workspace logo', () => {
    const expectedLogo = `url('test-image-address')`;
    component.workspace = { name: 'test', logo_url: 'test-image-address' };

    expect(component.workspaceLogoUrl).toEqual(expectedLogo);
  });

  it('should display the default workspace logo if the workspace does not have one', () => {
    const expectedLogo = `url('${constants.defaultWorkspaceLogo}')`;
    component.workspace = { name: 'test', logo_url: '' };

    expect(component.workspaceLogoUrl).toEqual(expectedLogo);
  });
});
