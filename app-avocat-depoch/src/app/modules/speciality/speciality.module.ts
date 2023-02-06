import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialityRoutingModule } from './speciality-routing.module';
import { ListeSpecialityComponent } from './view/liste-speciality/liste-speciality.component';
import { NouvelleSpecialityComponent } from './view/nouvelle-speciality/nouvelle-speciality.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListeSpecialityComponent,
    NouvelleSpecialityComponent
  ],
  imports: [
    CommonModule,
    SpecialityRoutingModule,
    SharedModule
  ]
})
export class SpecialityModule { }
