import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailsComponent } from './trails.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { provideMockStore } from '@ngrx/store/testing';
import { trailListInitialState, TRAILS_LIST_FEATURE_KEY } from '../../store/trail';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

describe('TrailsComponent', () => {
  let component: TrailsComponent;
  let fixture: ComponentFixture<TrailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [TRAILS_LIST_FEATURE_KEY]: trailListInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(TrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
