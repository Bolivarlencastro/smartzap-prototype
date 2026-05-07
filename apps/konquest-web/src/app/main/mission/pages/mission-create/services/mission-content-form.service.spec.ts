import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY, of } from 'rxjs';

import { MissionContentFormService } from './mission-content-form.service';

describe('MissionContentFormService', () => {
  let service: MissionContentFormService;
  let storeMock: jest.Mocked<Store>;
  let dialogMock: jest.Mocked<MatDialog>;
  let translateServiceMock: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    storeMock = { dispatch: jest.fn() } as any;
    dialogMock = { open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(EMPTY)) }) } as any;
    translateServiceMock = { translate: jest.fn().mockImplementation((value) => value) } as any;

    service = new MissionContentFormService(storeMock, dialogMock, translateServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
