import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogedInGuard } from './guards/loged-in.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../modules/home/home.module').then(mod => mod.HomeModule),
    canActivate: [LogedInGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('../modules/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
