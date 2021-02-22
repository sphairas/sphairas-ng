import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { GradeEditorComponent } from '../components/gradeeditor/gradeeditor.component';
import { MomentModule } from 'ngx-moment';
import { MatIconModule } from '@angular/material/icon';
import { ExamSheetComponent } from './exam-sheet/exam-sheet.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RecordsSheetComponent } from './records-sheet/records-sheet.component';
import { DialogModule } from 'primeng/dialog';
import { GradesPipe } from './records-sheet/grades.pipe';
import { DisplayGradePipe } from '../components/gradeeditor/display-grade.pipe';
import { TermSheetComponent } from './term-sheet/term-sheet.component';
import { ValuesPipe } from './term-sheet/values-pipe.pipe';
import { ReferencedValueComponent } from './term-sheet/referenced-value.component';
import { AverageValueComponent } from './term-sheet/average-value.component';

@NgModule({
  declarations: [
    GradesPipe,
    GradeEditorComponent,
    DisplayGradePipe,
    ExamSheetComponent,
    RecordsSheetComponent,
    TermSheetComponent,
    ValuesPipe,
    ReferencedValueComponent,
    AverageValueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    //TreeTableModule,
    DropdownModule,
    MomentModule,
    MatIconModule,
    InputNumberModule,
    ButtonModule,
    KeyFilterModule,
    DialogModule
  ]
})
export class SheetsModule { }
