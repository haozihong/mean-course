import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// for ditective
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
  ],
})
export class AuthModule {}
