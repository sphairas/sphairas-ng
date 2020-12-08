import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, filter, shareReplay, take, tap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { GradeValue } from 'src/app/types/gradevalue';

@Component({
  selector: 'app-exam-sheet',
  templateUrl: './exam-sheet.component.html',
  styleUrls: ['./exam-sheet.component.scss'],
  //changeDetection: ChangeDetectionStrategy.Default,
})
export class ExamSheetComponent implements OnInit {

  public distribution = [
    {
      "grade": "de.notensystem.os#00",
      "floor-fraction": 0.0
    },
    {
      "grade": "de.notensystem.os#01",
      "floor-fraction": 0.20
    },
    {
      "grade": "de.notensystem.os#02",
      "floor-fraction": 0.27
    },
    {
      "grade": "de.notensystem.os#03",
      "floor-fraction": 0.33
    },
    {
      "grade": "de.notensystem.os#04",
      "floor-fraction": 0.40
    },
    {
      "grade": "de.notensystem.os#05",
      "floor-fraction": 0.45
    },
    {
      "grade": "de.notensystem.os#06",
      "floor-fraction": 0.50
    },
    {
      "grade": "de.notensystem.os#07",
      "floor-fraction": 0.55
    },
    {
      "grade": "de.notensystem.os#08",
      "floor-fraction": 0.60
    },
    {
      "grade": "de.notensystem.os#09",
      "floor-fraction": 0.65
    },
    {
      "grade": "de.notensystem.os#10",
      "floor-fraction": 0.70
    },
    {
      "grade": "de.notensystem.os#11",
      "floor-fraction": 0.75
    },
    {
      "grade": "de.notensystem.os#12",
      "floor-fraction": 0.80
    },
    {
      "grade": "de.notensystem.os#13",
      "floor-fraction": 0.85
    },
    {
      "grade": "de.notensystem.os#14",
      "floor-fraction": 0.90
    },
    {
      "grade": "de.notensystem.os#15",
      "floor-fraction": 0.95
    }
  ];

  @Input()
  file: string;
  data: Observable<any>;
  // records: { grade: string, records: number[], id: string, name: string }[];
  // keys: { id: string, name: string, "max-value": number, weight: number }[];
  // distribution: { floor: number, grade: string }[] = [];
  _files_doc_rev: string;
  //changesSubject: Subject<string> = new ReplaySubject();
  //changes: Observable<string>;
  highlightGrade: string;
  display: boolean = true;

  count: Observable<number> = interval(1000);

  readonly stats = require('wink-statistics');

  //, private cdr: ChangeDetectorRef
  constructor(private files: FilesService, public conventions: ConventionsService, private activatedRoute: ActivatedRoute) {
    //this.changes = this.changesSubject.pipe(debounceTime(1000));
  }

  ngOnInit(): void {
    if (!this.file) this.file = this.activatedRoute.snapshot.paramMap.get('file');
    this.data = this.files.file(this.file).pipe(
      filter(t => !this._files_doc_rev || this._files_doc_rev !== t._rev),
      tap(t => {
        // if (this._doc_rev) {
        //   let externalChange = this._doc_rev !== t._rev;
        //   if (externalChange) this.changesSubject.next(t._rev);
        // };
        this._files_doc_rev = t._rev;
        this.updateDistribution(t, t.distribution ? 'fraction' : 'reset');
        // this.changesSubject.next(t._rev);
        // this.cdr.detectChanges();
      }),
      //tap(t => console.log("Next version " + t._rev)),
      shareReplay(1)//Does the magic to update without cdr.detectChanges();
    );
  }

  @HostListener('document:keydown.alt.arrowup', ['$event'])
  onMetaUpKey(event: KeyboardEvent) {
    this.data.pipe(take(1)).subscribe(data => {
      if (!data.distribution || data.distribution.length === 0) return;
      let i = data.distribution.findIndex(d => d.grade === this.highlightGrade);
      let n = (i >= 0 && i < data.distribution.length - 2) ? i + 1 : 0;
      this.highlightGrade = data.distribution[n].grade;
    });
  }

  @HostListener('document:keydown.alt.arrowdown', ['$event'])
  onMetaDownKey(event: KeyboardEvent) {
    this.data.pipe(take(1)).subscribe(data => {
      if (!data.distribution || data.distribution.length === 0) return;
      let i = data.distribution.findIndex(d => d.grade === this.highlightGrade);
      let n = (i >= 1 && i < data.distribution.length) ? i - 1 : data.distribution.length - 1;
      this.highlightGrade = data.distribution[n].grade;
    });
  }

  detectChanges() {
    console.log("Changes");
    //this.cdr.detectChanges();
  }

  private updateDistribution(data: any, update: string) {
    let s = this.stats.streaming.sum();
    data.keys.forEach(k => s.compute(k['max-value'] * k.weight));
    let sum = data['w-keysSum'] = s.value();

    if (update === 'reset') {
      let d = this.distribution.map(d => { return { ...d, floor: sum * d['floor-fraction'] } });
      data.distribution = d;
    } else {
      data.distribution.forEach(d => {
        if (update === 'fraction') d['floor-fraction'] = d.floor / sum;
        else if (update === 'floor') d.floor = sum * d['floor-fraction'];
      });
    }
    data.records.forEach(r => this.updateRow(r.id, data));
  }

  private updateRow(id: string, data: any) {
    let row: any = data.records.find(r => r.id === id);
    let s = this.stats.streaming.sum();
    for (var key in row.records) {
      let val: number = +row.records[key];
      if (isNaN(val)) continue;
      s.compute(val);
    }
    row.sum = s.value();
    if (!row['fixed-grade']) row.grade = this.distribute(row.sum, data.distribution);
  }

  distribute(sum: number, distribution: any[]): string {
    let i = distribution.length;
    while (--i >= 0) {
      if (sum >= distribution[i].floor) return this.distribution[i].grade;
    }
    return undefined;
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

  gradeChange(row: any, val: GradeValue) {
    if (!val || !val.id) return;
    row.grade = val.id;
    this.files.updateGrade(this.file, row.id, val.id)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  noteChange(row: any, value: string) {
    if (!value) return;
    row.note = value;
    this.files.updateNote(this.file, row.id, value)
      .subscribe(doc => this._files_doc_rev = doc.rev);
  }

  fixedGradeChange(row: any, value: boolean) {
    //this.service.updateNote(this.file, row.id, value)
    // .subscribe(doc => this._doc_rev = doc.rev);
  }

  maxValueChange(row: any, value: number) {
    this.data.pipe(take(1)).subscribe(d => {
      this.updateDistribution(d, 'floor');
      this.files.updateKeyAndDistribution(this.file, { id: row.id, 'max-value': value }, d.distribution)
        .subscribe(doc => this._files_doc_rev = doc.rev);
    });
  }

  distributionChange(change: { grade: string, floor: number }[]) {
    this.data.pipe(take(1)).subscribe(d => {
      this.updateDistribution(d, 'fraction');
      this.files.updateKeyAndDistribution(this.file, null, change)
        .subscribe(doc => this._files_doc_rev = doc.rev);
    });
  }

  addColumn() {
    this.data.pipe(take(1)).subscribe(data => {
      let c = data.keys.length === 0 ? 1 : Math.max(...data.keys.map(k => +k.id).filter(k => !isNaN(k))) + 1;
      let key = { id: '' + c, name: 'Aufg. ' + c, "max-value": 5, weight: 1 };
      data.keys.push(key);
      data.records.forEach(r => {
        if (!r.records) r.records = [];
        r.records[key.id] = 0;
      });
      this.updateDistribution(data, 'floor');
      this.files.updateKeyAndDistribution(this.file, key, data.distribution)
        .subscribe(doc => this._files_doc_rev = doc.rev);
    });
  }

  removeColumn(key: string) {
    this.data.pipe(take(1)).subscribe(data => {
      let i: number = data.keys.findIndex(k => k.id === key);
      if (i !== -1) {
        data.keys.splice(i, 1);
      }
      data.records.forEach(r => {
        if (r.records) {
          delete r.records[key];
        }
      });
      this.updateDistribution(data, 'floor');
      this.files.updateKeyAndDistribution(this.file, null, data.distribution, key)
        .subscribe(doc => this._files_doc_rev = doc.rev);
    });
  }

}
