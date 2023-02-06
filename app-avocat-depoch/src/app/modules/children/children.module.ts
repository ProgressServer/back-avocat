import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildrenRoutingModule } from './children-routing.module';
import { ListeChildrenComponent } from './view/liste-children/liste-children.component';
import { NouvelleChildrenComponent } from './view/nouvelle-children/nouvelle-children.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListeChildrenComponent,
    NouvelleChildrenComponent
  ],
  imports: [
    CommonModule,
    ChildrenRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class ChildrenModule { }
