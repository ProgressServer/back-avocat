import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { SignupComponent } from './view/signup/signup.component';
import { CanActivatNoConnectionGuard } from '../../guard/no-connection/can-activat-no-connection.guard';


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [CanActivatNoConnectionGuard] },
  { path: 'signUp', component: SignupComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }
