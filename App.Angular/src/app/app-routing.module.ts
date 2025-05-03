import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {AuthGuard} from "../auth.guard";

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: '**', redirectTo: '' },
];
