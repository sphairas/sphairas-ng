import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesMenuComponent } from './menu/menu.component';
import { CategoriesPipe } from './menu/categories.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CoursesMenuComponent, 
    CategoriesPipe
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [
    CoursesMenuComponent
  ]
})
export class LessonsModule { }
