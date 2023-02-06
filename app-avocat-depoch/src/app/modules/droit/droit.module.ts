import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DroitRoutingModule } from './droit-routing.module';
import { ListeDroitComponent } from './view/liste-droit/liste-droit.component';
import { NouvelleDroitComponent } from './view/nouvelle-droit/nouvelle-droit.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SousCategorieComponent } from './view/sous-categorie/sous-categorie.component';

@NgModule({
  declarations: [
    ListeDroitComponent,
    NouvelleDroitComponent,
    SousCategorieComponent
  ],
  imports: [
    CommonModule,
    DroitRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class DroitModule { }
