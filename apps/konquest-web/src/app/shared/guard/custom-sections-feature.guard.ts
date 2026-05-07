import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

export const customSectionsFeature: CanActivateFn = () => {
  const isCustomSectionsActive = getCustomSectionsStatus();

  if (isCustomSectionsActive) {
    return redirectToDefault();
  }

  return true;
};

function getCustomSectionsStatus(): boolean {
  const workspaceService = inject(WorkspaceService);
  const customSectionsId = environment.apps.konquest.services.customSections.id;
  return workspaceService.isServiceActive(customSectionsId);
}

function redirectToDefault() {
  const router = inject(Router);
  return router.parseUrl('/');
}
