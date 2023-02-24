import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListsComponent } from './users-lists/users-lists.component';

import { MainLayoutComponent } from './structure/main-layout/main-layout.component';
import { GenesComponent } from './genes/genes.component';
import { DiseasesComponent } from './diseases/diseases.component';
import { CompaniesComponent } from './companies/companies.component';
import { DrugsComponent } from './drugs/drugs.component';
import { MoasComponent } from './moas/moas.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: UsersListsComponent },
    ]
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },
  {
    path: 'users-lists',
    component: MainLayoutComponent,
    children: [
      { path: '', component: UsersListsComponent },
    ]
  },
  {
    path: 'genes',
    component: MainLayoutComponent,
    children: [
      { path: '', component: GenesComponent },
    ]
  },
  {
    path: 'diseases',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DiseasesComponent },
    ]
  },
  {
    path: 'companies',
    component: MainLayoutComponent,
    children: [
      { path: '', component: CompaniesComponent },
    ]
  },
  {
    path: 'drugs',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DrugsComponent },
    ]
  },
  {
    path: 'moas',
    component: MainLayoutComponent,
    children: [
      { path: '', component: MoasComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  bootstrap: []
})
export class AdminRoutingModule { }
