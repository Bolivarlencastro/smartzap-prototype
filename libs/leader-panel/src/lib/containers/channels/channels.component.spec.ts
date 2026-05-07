import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelsComponent } from './channels.component';
import { provideMockStore } from '@ngrx/store/testing';
import { channelListInitialState, CHANNELS_LIST_FEATURE_KEY } from '../../store/channel';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

describe('ChannelsComponent', () => {
  let component: ChannelsComponent;
  let fixture: ComponentFixture<ChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [CHANNELS_LIST_FEATURE_KEY]: channelListInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
