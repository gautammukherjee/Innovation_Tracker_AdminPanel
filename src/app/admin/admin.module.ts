import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListsComponent } from './users-lists/users-lists.component';
import { GenesComponent } from './genes/genes.component';
import { DiseasesComponent } from './diseases/diseases.component';
import { CompaniesComponent } from './companies/companies.component';
import { DrugsComponent } from './drugs/drugs.component';
import { MoasComponent } from './moas/moas.component';
import { NewslettersComponent } from './newsletters/newsletters.component';
import { DiseaseSynsComponent } from './disease-syns/disease-syns.component';
import { DrugSynsComponent } from './drug-syns/drug-syns.component';
import { GeneSynsComponent } from './gene-syns/gene-syns.component';
import { TasComponent } from './tas/tas.component';

@NgModule({
  declarations: [
    IndexComponent,
    DashboardComponent,
    UsersListsComponent,
    GenesComponent,
    DiseasesComponent,
    CompaniesComponent,
    DrugsComponent,
    MoasComponent,
    NewslettersComponent,
    DiseaseSynsComponent,
    DrugSynsComponent,
    GeneSynsComponent,
    TasComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    // BrowserModule,
    FormsModule,
    // RouterModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class AdminModule { }
