import { Injectable } from '@angular/core';
import { combineLatest, from, of } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take, tap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { GradeValue } from 'src/app/types/gradevalue';


require('events').EventEmitter.defaultMaxListeners = 50;

@Injectable()
export class TermSheetService {

  file: string;
  data: Observable<any>;
  private unfiltered: Observable<any>;
  private _files_doc_rev: string;

  readonly stats = require('wink-statistics');

  constructor(private files: FilesService, private conventions: ConventionsService) { }

  setCurrent(file: string) {
    this.file = file;
    this._files_doc_rev = undefined;
    this.unfiltered = this.files.file(this.file);
    this.data = this.unfiltered.pipe(
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
    let students: { id: string, name: string, note: string, err: boolean }[] = [];
    data.keys.forEach(k => {
      if (k.values && k['sheet-document-reference']) throw "Can't have both values and reference";
      if (k.values) {
        k.values.forEach(v => {
          let stud = students.find(s => s.id === v.id);
          if (!stud) students.push({ id: v.id, name: v.name, note: undefined, err: false });
          else if (stud.name !== v.name) stud.err = true;
        })
      } else if (k['sheet-document-reference']) {
        //TODO
      }
    });
    data.notes?.forEach(note => {
      let row = students.find(s => s.id === note.student);
      if (row) row.note = note.text;
      else students.push({ id: note.student, name: note.student, note: note, err: true });
    });
    students.sort((s1, s2) => s1.name.localeCompare(s2.name));
    data.students = students;
  }

  initAverage(data: any, fun: { type: string, references: { 'referenced-key': string, weight: number }[] }, student: string, reduce: (arr: { grade: string, weight: number }[]) => number): Observable<number> {
    let arr: Observable<{ grade: string, weight: number }>[] = [];
    fun.references.forEach(r => {
      let key = data.keys.find(k => k.id === r['referenced-key']);
      if (!key) throw 'Key not found';
      let weight: number = r.weight;
      if (key['sheet-document-reference']) {
        let ref: { doc: string, id: string } = key['sheet-document-reference'];
        arr.push(this.findReference(ref.doc, student, weight));
      } else { //
        let record = this.unfiltered.pipe(
          map(d => d.keys.find(k => k.id === key.id)?.values),
          map(values => values?.find(v => v.id === student)),
          filter(value => value && value.grade),
          map(value => { return { grade: value.grade, weight: weight } }),
          shareReplay(1)
        );
        arr.push(record);
      }
    });
    let grades: Observable<any> = combineLatest(arr);
    return grades.pipe(
      map(reduce),
      shareReplay(1)
    );
  }

  private findReference(doc: string, student: string, weight: number): Observable<{ grade: string, weight: number }> {
    return this.files.file(doc).pipe(
      map(data => {
        let record = data.records.find(r => r.id === student);
        return record ? { grade: record.grade, weight: weight } : undefined;
      }),
      shareReplay(1)//Does the magic to update without cdr.detectChanges(); //??
    );
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

  keyNameChange(col: any, val: string) {
    if (!val || val === '') return;
    col.name = val;
    this.updateKeyName(this.file, col.id, val)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  private updateKeyName(file: string, key: string, value: string): Observable<any> {
    let doc = `file:${file}`;
    let ret = this.files.change(doc, d => {
      let k = d.keys.find(r => r.id === key);
      if (k) k.name = value;
      return d;
    });
    return from(ret);
  }

  removeKey(key: string) {
    //remove key from average
  }

  scoreValueChange(row: string, col: string, value: number) {
    // if (!text) return;
    // let value: number = +text;
    // if (isNaN(value)) return;
    //https://www.digitalocean.com/community/tutorials/angular-viewchild-access-component
    //https://stackoverflow.com/questions/40165294/access-multiple-viewchildren-using-viewchild
    //moveToNextCell in class EditableColumn 
    //https://github.com/primefaces/primeng/blob/6a44036b7e97080f0ee035b96650e83d75e39b82/src/app/components/table/table.ts 
    this.updateScore(row, col, value)
      .subscribe(doc => this._files_doc_rev = doc.rev);
    this.data.pipe(take(1)).subscribe(d => this.updateRow(row, d));
  }

  private updateScore(student: string, key: string, value: number): Observable<any> {
    let doc = `file:${this.file}`;
    let ret = this.files.change(doc, d => {
      let entry = d.records.find(r => r.id === student);
      if (entry && entry.records) {
        entry.records[key] = value;
      }
      return d;
    });
    return from(ret);
  }

  gradeChange(col: any, student: string, val: GradeValue) {
    if (!val || !val.id) return;
    col.values.find(v => v.id === student).grade = val.id;
    this.updateTermGrade(col.id, student, val.id)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  private updateTermGrade(key: string, student: string, value: string): Observable<any> {
    let doc = `file:${this.file}`;
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

  noteChange(row: any, value: string) {
    if (!value || value === row.note) return;
    row.note = value;
    this.updateNote(row.id, value)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  updateNote(student: string, text: string): Observable<any> {
    let doc = `file:${this.file}`;
    let ret = this.files.change(doc, d => {
      if (!d.notes) d.notes = [];
      let note = d.notes.find(n => n.student === student);
      if (note) {
        note.text = text;
      } else {
        note = { student: student, text: text };
        d.notes.push(note);
      }
      return d;
    });
    return from(ret);
  }
}
