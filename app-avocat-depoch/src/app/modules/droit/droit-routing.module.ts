import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeDroitComponent } from './view/liste-droit/liste-droit.component';
import { NouvelleDroitComponent } from './view/nouvelle-droit/nouvelle-droit.component';
import { CanActivatAdminGuard } from "../../guard/admin/can-activat-admin.guard";
import { SousCategorieComponent } from './view/sous-categorie/sous-categorie.component';


const routes: Routes = [
  { path: '', component: ListeDroitComponent, canActivate: [CanActivatAdminGuard] },
  {
    path: 'nouveau', component: NouvelleDroitComponent, children: [
      {
        path: 'droit',
        component: NouvelleDroitComponent
      },
      {
        path: 'sous-categorie',
        component: NouvelleDroitComponent
      }

    ], canActivate: [CanActivatAdminGuard]
  },
  { path: 'souscategorie/:id', component: SousCategorieComponent, canActivate: [CanActivatAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DroitRoutingModule { }
