import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsheetComponent } from './termsheets/termsheet/termsheet.component';
import { AuthGuardService } from './authguard.service';
import { AppMainComponent } from './app.main';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'app',
    component: AppMainComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'termsheet/:document',
        component: TermsheetComponent,
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
