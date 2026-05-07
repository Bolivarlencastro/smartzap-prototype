/**
 * Returns if the user can access a route by checking if at least one of the roles required to access the route are present in the requiredRoles array.
 * @param requiredRoles The list of roles that can access the route.
 * @param roles The user's roles.
 */
export function hasRouteRole(requiredRoles: string[], roles: string[]): any {
  let granted = false;
  if (!requiredRoles || requiredRoles.length === 0) {
    granted = true;
  } else {
    for (const requiredRole of requiredRoles) {
      if (roles.indexOf(requiredRole) > -1) {
        granted = true;
        break;
      }
    }
  }

  return granted;
}

export const ROLE_ADMIN = 'basic_analytics_admin';
export const ROLE_LEADER = 'basic_analytics_leader';
export const ROLE_USER = 'basic_analytics_user';
