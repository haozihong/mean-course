import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {};

  // if return true, the router know this route is accessable
  // if return false, should provide an alternative, otherwise just blocking the route
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
     const isAuth = this.authService.getIsAuth();
     if (!isAuth) {
      this.router.navigate(['/auth/login']);
     }
     return isAuth;
  }
}
