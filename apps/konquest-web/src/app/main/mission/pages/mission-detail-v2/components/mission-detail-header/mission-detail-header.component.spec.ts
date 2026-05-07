import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDetailHeaderComponent } from './mission-detail-header.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionDetailHeaderComponent', () => {
  let component: MissionDetailHeaderComponent;
  let fixture: ComponentFixture<MissionDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionDetailHeaderComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit close', () => {
    const emitSpy = jest.spyOn(component.closeClick, 'emit');

    component.emitClose();

    expect(emitSpy).toHaveBeenCalled();
  });
});
