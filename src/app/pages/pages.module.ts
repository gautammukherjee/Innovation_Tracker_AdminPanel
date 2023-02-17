import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages-routing.module';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListsComponent } from './users-lists/users-lists.component';


@NgModule({
  declarations: [
    IndexComponent,
    DashboardComponent,
    UsersListsComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    // BrowserModule,
    FormsModule,
    // RouterModule,
  ],
  exports: [
  ]
})
export class PagesModule { }
