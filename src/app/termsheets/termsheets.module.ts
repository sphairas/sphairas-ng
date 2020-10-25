import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TermsheetComponent } from './termsheet/termsheet.component';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { DropdownModule } from 'primeng/dropdown';
import { GradesPipe } from './termsheet/grades.pipe';
import { GradeEditorComponent } from './gradeeditor/gradeeditor.component';
import { MomentModule } from 'ngx-moment';
import { DisplayGradePipe } from './display-grade.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ExamSheetComponent } from '../sheets/exam-sheet/exam-sheet.component';

@NgModule({
  declarations: [
    TermsheetComponent,
    GradesPipe,
    GradeEditorComponent,
    DisplayGradePipe,
    ExamSheetComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    //TreeTableModule,
    DropdownModule,
    MomentModule,
    MatIconModule
  ]
})
export class TermSheetsModule { }
