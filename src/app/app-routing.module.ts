import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './authguard.service';
import { AppMainComponent } from './app.main';
import { ExamSheetComponent } from './sheets/exam-sheet/exam-sheet.component';
import { RecordsSheetComponent } from './sheets/records-sheet/records-sheet.component';

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
        path: 'records-sheet/:file',
        component: RecordsSheetComponent,
      },
      {
        path: 'student-sheet/:file',
        component: ExamSheetComponent,
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
