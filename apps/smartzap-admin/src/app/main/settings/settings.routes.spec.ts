import routes from './settings.routes';
import { SettingsComponent, SettingsEnrollmentsComponent, SettingsGeneralComponent } from './containers';

describe('settings routes', () => {
  it('should expose enrollments and configurations routes', () => {
    expect(routes.length).toBe(3);

    const configurationsRoute = routes[0];
    const legacyGeneralRoute = routes[1];
    const rootRoute = routes[2];

    expect(rootRoute.path).toBe('');
    expect(rootRoute.component).toBe(SettingsComponent);
    expect(rootRoute.providers?.length).toBeGreaterThan(0);
    expect(rootRoute.children).toEqual([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'enrollments',
      },
      {
        path: 'enrollments',
        component: SettingsEnrollmentsComponent,
      },
      {
        path: '**',
        redirectTo: 'enrollments',
      },
    ]);

    expect(configurationsRoute).toMatchObject({
      path: 'configurations',
      component: SettingsGeneralComponent,
    });
    expect(configurationsRoute.providers?.length).toBeGreaterThan(0);

    expect(legacyGeneralRoute).toEqual({
      path: 'general',
      pathMatch: 'full',
      redirectTo: 'configurations',
    });
  });
});
