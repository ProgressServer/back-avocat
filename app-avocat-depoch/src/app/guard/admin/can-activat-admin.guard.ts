import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { AuthentificationService } from '../../services/authentificationService/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivatAdminGuard implements CanActivate {
  constructor(private authentificationService: AuthentificationService, private router: Router, private toastr: ToastrService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authentificationService.loggedIn()) {
      const user: User | undefined = this.authentificationService.getUser();
      if (user) {
        return true;
      }
      this.router.navigate(['/admin/login']);
      return false;
    } else {
      this.router.navigate(['/admin/login']);
      return false;
    }
  }

}
