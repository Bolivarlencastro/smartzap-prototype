import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '../../utils';
import { IntegrationCardComponent } from './integration-card.component';

describe('IntegrationCardComponent', () => {
  let component: IntegrationCardComponent;
  let fixture: ComponentFixture<IntegrationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IntegrationCardComponent,
        getTranslocoTestingModule(),
        MatIconModule,
        MatButtonModule,
        MatSlideToggleModule,
        RouterModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('activeChangeEvent', () => {
    const cases: any[] = [
      [{ id: 'teams' }, { checked: true }, false],
      [{ id: 'teams' }, { checked: false }, false],
      [{ id: 'alura' }, { checked: true }, false],
      [{ id: 'alura' }, { checked: false }, true],
    ];

    test.each(cases)(
      'should emit activeChange event when " %p " and " %p "',
      (integration, toggleEvent, writeValue) => {
        fixture.componentRef.setInput('integration', integration);
        const event: MatSlideToggleChange = { ...toggleEvent, source: { writeValue: jest.fn() } };
        const writeValueSpy = jest.spyOn(event.source, 'writeValue');
        const emitSpy = jest.spyOn(component.activeChange, 'emit');

        component.toggleChanged(event);

        if (writeValue) {
          expect(writeValueSpy).toHaveBeenCalledWith(!toggleEvent.checked);
        } else {
          expect(writeValueSpy).not.toHaveBeenCalled();
        }

        expect(emitSpy).toHaveBeenCalledWith(toggleEvent.checked);
      },
    );
  });
});
