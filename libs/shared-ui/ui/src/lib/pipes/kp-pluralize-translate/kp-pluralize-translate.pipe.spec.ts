import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpPluralizeTranslatePipe } from './kp-pluralize-translate.pipe';

describe('KpPluralizeTranslocoService', () => {
  let translateService: TranslocoService;
  let pipe: KpPluralizeTranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
    });
    translateService = TestBed.inject(TranslocoService);
    pipe = new KpPluralizeTranslatePipe(translateService);
  });

  it('create an instance', () => {
    const pipe = new KpPluralizeTranslatePipe(translateService);
    expect(pipe).toBeTruthy();
  });

  it('should return plural', () => {
    const result = pipe.transform('BULBASAUR', { value: 3 });
    expect(result).toBe('BULBASAUR.PLURAL');
  });

  it('should return singular', () => {
    const result = pipe.transform('BULBASAUR', { value: 1 });
    expect(result).toBe('BULBASAUR.SINGULAR');
  });

  it('should return plural if has not value as argument', () => {
    const result = pipe.transform('BULBASAUR', { something: 3 });
    expect(result).toBe('BULBASAUR.PLURAL');
  });
});
