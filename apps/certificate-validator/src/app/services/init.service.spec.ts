import { TestBed } from '@angular/core/testing';
import { InitService } from './init.service';
import { TranslocoService } from '@jsverse/transloco';

describe('InitService', () => {
  let service: InitService;
  let translocoServiceMock: { setActiveLang: jest.Mock; setDefaultLang: jest.Mock };

  const setNavigatorLanguages = (langs: string[]) => {
    Object.defineProperty(window.navigator, 'languages', {
      value: langs,
      configurable: true,
    });
  };

  beforeEach(() => {
    translocoServiceMock = {
      setActiveLang: jest.fn(),
      setDefaultLang: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [InitService, { provide: TranslocoService, useValue: translocoServiceMock }],
    });

    service = TestBed.inject(InitService);
  });

  it('should set language when an exact match exists in navigator.languages', async () => {
    setNavigatorLanguages(['es', 'en-US']);

    await service.init();

    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('es');
    expect(translocoServiceMock.setDefaultLang).toHaveBeenCalledWith('es');
  });

  it('should fall back to language without region when supported', async () => {
    setNavigatorLanguages(['en-US', 'pt-PT']);

    await service.init();

    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('en');
    expect(translocoServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('should use fallback when no language is supported', async () => {
    setNavigatorLanguages(['fr-FR', 'de-DE']);

    await service.init();

    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('pt-BR');
    expect(translocoServiceMock.setDefaultLang).toHaveBeenCalledWith('pt-BR');
  });
});
