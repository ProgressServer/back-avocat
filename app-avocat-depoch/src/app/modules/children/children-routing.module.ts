import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeChildrenComponent } from './view/liste-children/liste-children.component';
import { NouvelleChildrenComponent } from './view/nouvelle-children/nouvelle-children.component';

const routes: Routes = [
  {
    path: '', component: ListeChildrenComponent, children: [
      {
        path: 'sous-categorie',
        component: ListeChildrenComponent
      }

    ],
  },
  { path: 'nouveau', component: NouvelleChildrenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildrenRoutingModule { }
