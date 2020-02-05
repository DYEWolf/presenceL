import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DataTableComponent, NgbdSortableHeader } from './components/data-table/data-table.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    DataTableComponent,
    NgbdSortableHeader
  ],
  imports: [
    MatFormFieldModule,
    CommonModule,
    HomeRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatCheckboxModule
  ]
})
export class HomeModule { }
