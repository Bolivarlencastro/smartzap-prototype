import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpLearnContentCardComponent } from './kp-learn-content-card.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { LearnContentCardActionId } from '../../models';

describe('LearnContentCardComponent', () => {
  let component: KpLearnContentCardComponent;
  let fixture: ComponentFixture<KpLearnContentCardComponent>;
  const mainAction: LearnContentCardActionId = 'continue';
  const remainingActions: LearnContentCardActionId[] = ['details', 'add-bookmark'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpLearnContentCardComponent, getTranslocoTestingModule(), MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KpLearnContentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actions', [mainAction, ...remainingActions]);
    fixture.detectChanges();
  });

  it('should split the provided actions', () => {
    expect(component.mainAction).toBe(mainAction);
    expect(component.remainingActions).toEqual(expect.arrayContaining(remainingActions));
  });

  it('should emit the action', () => {
    const emitSpy = jest.spyOn(component.cardAction, 'emit');
    const mockEvent = { stopPropagation: jest.fn() } as unknown as MouseEvent;
    component.onCardAction(mainAction, mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(mainAction);
  });
});
