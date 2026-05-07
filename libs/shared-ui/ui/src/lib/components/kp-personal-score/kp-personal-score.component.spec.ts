import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpPersonalScoreComponent } from './kp-personal-score.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('KpPersonalScoreComponent', () => {
  let component: KpPersonalScoreComponent;
  let fixture: ComponentFixture<KpPersonalScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpPersonalScoreComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(KpPersonalScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit navigate event', () => {
    const emitSpy = jest.spyOn(component.navigate, 'emit');
    const closeMenuSpy = jest.spyOn(component.menuTrigger, 'closeMenu');
    component.navigateToGeneralRanking();
    expect(emitSpy).toHaveBeenCalled();
    expect(closeMenuSpy).toHaveBeenCalled();
  });
});
