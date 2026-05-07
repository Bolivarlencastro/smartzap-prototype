import { NewCertificateDialogFacade } from './new-certificate-dialog.facade';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { NewCertificateDialogActions } from '../store/actions';
import { Chance } from 'chance';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('NewCertificateDialogFacade', () => {
  let facade: NewCertificateDialogFacade;
  let storeMock: jest.Mocked<Store>;
  const chance = new Chance();

  beforeEach(async () => {
    storeMock = { select: jest.fn().mockReturnValue(of(EMPTY)), dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    facade = new NewCertificateDialogFacade(storeMock);
  });

  it('should dispatch the new certificate action', () => {
    facade.newCertificate();

    expect(storeMock.dispatch).toHaveBeenCalledWith(NewCertificateDialogActions.openNewCertificateDialog());
  });

  it('should dispatch the edit certificates action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    facade.editCertificate(certificate);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      NewCertificateDialogActions.openEditCertificateDialog({ certificate }),
    );
  });

  it('should dispatch the save certificate action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    facade.saveCertificate(certificate);

    expect(storeMock.dispatch).toHaveBeenCalledWith(NewCertificateDialogActions.saveCertificate({ certificate }));
  });

  it('should dispatch the upload image action', () => {
    const image = new File([], 'image.png');

    facade.uploadImage(image, 'backgroundImage');

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      NewCertificateDialogActions.setImage({ image, imageDef: 'backgroundImage' }),
    );
  });
});
