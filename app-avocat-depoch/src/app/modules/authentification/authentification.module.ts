import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthentificationRoutingModule } from './authentification-routing.module';
import { LoginComponent } from './view/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './view/signup/signup.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],  
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    SharedModule
  ]
})
export class AuthentificationModule { }
