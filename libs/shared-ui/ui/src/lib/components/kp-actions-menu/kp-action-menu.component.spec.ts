import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpActionMenuItem } from './kp-action-menu-item';
import { KpActionMenuComponent } from './kp-action-menu.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('KpActionMenuComponent', () => {
  let component: KpActionMenuComponent;
  let fixture: ComponentFixture<KpActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpActionMenuComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should split the provided actions', () => {
    const expectedMainAction: KpActionMenuItem = {
      id: 'open',
      label: 'Open',
    };
    const expectedRemainingActions = [
      {
        id: 'open',
        label: 'Open',
      },
      {
        id: 'edit',
        label: 'Edit',
      },
      {
        id: 'delete',
        label: 'Delete',
      },
    ];

    fixture.componentRef.setInput('actions', [expectedMainAction, ...expectedRemainingActions]);

    expect(component.mainAction).toMatchObject(expectedMainAction);
    expect(component.remainingActions).toEqual(expect.arrayContaining(expectedRemainingActions));
  });

  it('should not display the secondary actions dropdown menu button if there are no secondary actions', () => {
    const mockMainAction: KpActionMenuItem = {
      id: 'open',
      label: 'Open',
    };

    fixture.componentRef.setInput('actions', [mockMainAction]);
    fixture.detectChanges();

    const secondaryActionsDropdown: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-test="secondary-actions-dropdown"]',
    );

    expect(secondaryActionsDropdown).toBeFalsy();
  });
});
