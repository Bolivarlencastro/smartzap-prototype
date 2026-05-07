import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../util';
import { GeneralRankingTableComponent } from './general-ranking-table.component';

describe('GeneralRankingTableComponent', () => {
  let component: GeneralRankingTableComponent;
  let fixture: ComponentFixture<GeneralRankingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneralRankingTableComponent, getTranslocoTestingModule()],
      providers: [{ provide: AuthService, useValue: { userId: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(GeneralRankingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit cleanFilterEvent event', () => {
    const emitSpy = jest.spyOn(component.cleanFilterEvent, 'emit');
    component.cleanFilter();
    expect(emitSpy).toHaveBeenCalled();
  });
});
