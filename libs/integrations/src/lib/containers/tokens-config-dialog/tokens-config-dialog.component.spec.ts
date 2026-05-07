import { TokensConfigDialogComponent } from './tokens-config-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../utils';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TOKENS_DIALOG_FEATURE_NAME, tokensDialogFeature, tokensDialogInitialState } from '../../store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TokensConfigService } from '../../services';
import { TokensDialogActions } from '../../store/actions';
import { IntegrationTokensDto } from '../../models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockTokens: IntegrationTokensDto = {
  sso: 'mock_token',
  courses: 'mock_token',
  enrollment_progress: 'mock_token',
  finished_enrollments: 'mock_token',
};

describe('TokensConfigDialogComponent', () => {
  let component: TokensConfigDialogComponent;
  let fixture: ComponentFixture<TokensConfigDialogComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let tokensConfigServiceMock: jest.Mocked<TokensConfigService>;

  beforeEach(async () => {
    tokensConfigServiceMock = {
      integrationTokenValidator: jest.fn().mockReturnValue(null),
    } as unknown as jest.Mocked<TokensConfigService>;
    await TestBed.configureTestingModule({
      imports: [TokensConfigDialogComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: { [TOKENS_DIALOG_FEATURE_NAME]: tokensDialogInitialState } }),
        {
          provide: TokensConfigService,
          useValue: tokensConfigServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(TokensConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch save tokens action', () => {
    component.form.patchValue(mockTokens);

    component.saveTokens();

    expect(dispatchSpy).toHaveBeenCalledWith(TokensDialogActions.saveTokens({ tokens: mockTokens }));
  });

  it('should dispatch the reset state action', () => {
    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(TokensDialogActions.reset());
  });

  it('should disable the form when loading', () => {
    store.overrideSelector(tokensDialogFeature.selectViewModel, {
      tokens: mockTokens,
      isLoading: true,
      showSpinner: false,
    });
    store.refreshState();

    expect(component.form.disabled).toBe(true);
  });

  it('should patch the form with the tokens value from the store', () => {
    const patchValueSpy = jest.spyOn(component.form, 'patchValue');
    store.overrideSelector(tokensDialogFeature.selectViewModel, {
      tokens: mockTokens,
      isLoading: false,
      showSpinner: false,
    });
    store.refreshState();

    expect(patchValueSpy).toHaveBeenCalledWith(mockTokens, { emitEvent: false });
    expect(component.form.getRawValue()).toMatchObject(mockTokens);
  });
});
