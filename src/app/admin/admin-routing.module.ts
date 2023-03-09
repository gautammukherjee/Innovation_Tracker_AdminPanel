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
import { NewslettersComponent } from './newsletters/newsletters.component';
import { DiseaseSynsComponent } from './disease-syns/disease-syns.component';
import { GeneSynsComponent } from './gene-syns/gene-syns.component';
import { DrugSynsComponent } from './drug-syns/drug-syns.component';
import { TasComponent } from './tas/tas.component';

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
    path: 'newsletters',
    component: MainLayoutComponent,
    children: [
      { path: '', component: NewslettersComponent },
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
    path: 'gene-syns',
    component: MainLayoutComponent,
    children: [
      { path: '', component: GeneSynsComponent },
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
    path: 'disease-syns',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DiseaseSynsComponent },
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
    path: 'drug-syns',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DrugSynsComponent },
    ]
  },
  {
    path: 'moas',
    component: MainLayoutComponent,
    children: [
      { path: '', component: MoasComponent },
    ]
  },
  {
    path: 'tas',
    component: MainLayoutComponent,
    children: [
      { path: '', component: TasComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  bootstrap: []
})
export class AdminRoutingModule { }
