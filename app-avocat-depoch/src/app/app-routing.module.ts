import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'admin/login',
    loadChildren: () => import('./modules/authentification/authentification.module').then(m => m.AuthentificationModule)
  },
  {
    path: 'admin/droit',
    loadChildren: () => import('./modules/droit/droit.module').then(m => m.DroitModule)
  },
  {
    path: 'admin/speciality',
    loadChildren: () => import('./modules/speciality/speciality.module').then(m => m.SpecialityModule)
  },
  {
    path: 'admin/children',
    loadChildren: () => import('./modules/children/children.module').then(m => m.ChildrenModule)
  },
  {
    path: 'admin/children/:id/:titre',
    loadChildren: () => import('./modules/children/children.module').then(m => m.ChildrenModule)
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
