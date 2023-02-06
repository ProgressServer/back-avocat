import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeSpecialityComponent } from './view/liste-speciality/liste-speciality.component';
import { NouvelleSpecialityComponent } from './view/nouvelle-speciality/nouvelle-speciality.component';

const routes: Routes = [
  { path: '', component: ListeSpecialityComponent },
  { path: 'nouveau', component: NouvelleSpecialityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialityRoutingModule { }
