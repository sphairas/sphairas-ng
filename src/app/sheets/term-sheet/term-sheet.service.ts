import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, shareReplay, take, tap } from 'rxjs/operators';
import { FilesService } from 'src/app/files.service';
import { GradeValue } from 'src/app/types/gradevalue';

@Injectable()
export class TermSheetService {

  file: string;
  data: Observable<any>;
  private _files_doc_rev: string;

  readonly stats = require('wink-statistics');

  constructor(private files: FilesService) { }

  setCurrent(file: string) {
    this.file = file;
    this._files_doc_rev = undefined;
    this.data = this.files.file(this.file).pipe(
      filter(t => !this._files_doc_rev || this._files_doc_rev !== t._rev),
      tap(t => {
        // if (this._doc_rev) {
        //   let externalChange = this._doc_rev !== t._rev;
        //   if (externalChange) this.changesSubject.next(t._rev);
        // };
        this._files_doc_rev = t._rev;
        this.updateStudents(t);
      }),
      //tap(t => console.log("Next version " + t._rev)),
      shareReplay(1)//Does the magic to update without cdr.detectChanges();
    );
  }

  private updateStudents(data: any) {
    let students: { id: string, name: string, err: boolean }[] = [];
    data.keys.forEach(k => {
      if (k.values && k['sheet-document-reference']) throw "Can't have both values and reference";
      if (k.values) {
        k.values.forEach(v => {
          let stud = students.find(s => s.id === v.id);
          if (!stud) students.push({ id: v.id, name: v.name, err: false });
          else if (stud.name !== v.name) stud.err = true;
        })
      } else if (k['sheet-document-reference']) {
        //TODO
      }
    });
    students.sort((s1, s2) => s1.name.localeCompare(s2.name));
    data.students = students;
  }

  private updateRow(id: string, data: any) {
    let row: any = data.records.find(r => r.id === id);
    let s = this.stats.streaming.sum();
    for (var key in row.records) {
      let def = data.keys.find(k => k.id === key);
      let val: number = +row.records[key];
      if (isNaN(val)) continue;
      let weighted: number = (def && def.weight) ? val * def.weight : val;
      s.compute(weighted);
    }
    row.sum = s.value();
    // if (!row['fixed-grade']) row.grade = this.distribute(row.sum, data.distribution);
  }

  scoreValueChange(row: string, col: string, value: number) {
    // if (!text) return;
    // let value: number = +text;
    // if (isNaN(value)) return;
    //https://www.digitalocean.com/community/tutorials/angular-viewchild-access-component
    //https://stackoverflow.com/questions/40165294/access-multiple-viewchildren-using-viewchild
    //moveToNextCell in class EditableColumn 
    //https://github.com/primefaces/primeng/blob/6a44036b7e97080f0ee035b96650e83d75e39b82/src/app/components/table/table.ts 
    this.files.updateScore(this.file, row, col, value)
      .subscribe(doc => this._files_doc_rev = doc.rev);
    this.data.pipe(take(1)).subscribe(d => this.updateRow(row, d));
  }

  gradeChange(col: any, student: string, val: GradeValue) {
    if (!val || !val.id) return;
    col.values.find(v => v.id === student).grade = val.id;
    this.updateTermGrade(this.file, col.id, student, val.id)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  noteChange(row: any, value: string) {
    if (!value) return;
    row.note = value;
    this.files.updateNote(this.file, row.id, value)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  private updateTermGrade(file: string, key: string, student: string, value: string): Observable<any> {
    let doc = `file:${file}`;
    let ret = this.files.change(doc, d => {
      let k = d.keys.find(r => r.id === key);
      if (k && k.values) {
        let entry = k.values.find(r => r.id === student);
        if (entry && entry.grade) {
          entry.grade = value;
        }
      }
      return d;
    });
    return from(ret);
  }

}
