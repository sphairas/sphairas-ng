import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { ConventionsService } from 'src/app/conventions.service';
import { GradeValue } from 'src/app/types/gradevalue';
import { TermSheetService } from './term-sheet.service';

@Component({
  selector: 'app-term-sheet',
  templateUrl: './term-sheet.component.html',
  styleUrls: ['./term-sheet.component.scss'],
  //changeDetection: ChangeDetectionStrategy.Default,
  providers: [TermSheetService]
})
export class TermSheetComponent implements OnInit {

  file: string;
  //data: Observable<any>; // = new Subject();
  // records: { grade: string, records: number[], id: string, name: string }[];
  // keys: { id: string, name: string, "max-value": number, weight: number }[];
  // distribution: { floor: number, grade: string }[] = [];
  //changesSubject: Subject<string> = new ReplaySubject();
  //changes: Observable<string>;
  highlightGrade: string;
  display: boolean = true;

  count: Observable<number> = interval(1000);

  //, private cdr: ChangeDetectorRef
  constructor(public service: TermSheetService, public conventions: ConventionsService, private activatedRoute: ActivatedRoute) {
    //this.changes = this.changesSubject.pipe(debounceTime(1000));
    this.activatedRoute.paramMap.subscribe(() => this.ngOnInit());
  }

  ngOnInit(): void {
    let routed = this.activatedRoute.snapshot.paramMap.get('file');
    if (this.file === routed) return;
    this.file = routed;
    this.service.setCurrent(this.file);
    //this.data.next( this.service.data);
    //this.data = this.service.data;
  }

  get data() {
    return this.service.data;
  }

  keyNameChange(col: any, value: string) {
    this.service.keyNameChange(col, value);
  }

  removeKey(key: string) {
    this.service.removeKey(key);
  }

  scoreValueChange(row: string, col: string, value: number) {
    this.service.scoreValueChange(row, col, value);
  }

  gradeChange(col: any, student: string, val: GradeValue) {
    this.service.gradeChange(col, student, val);
  }

  noteChange(row: any, value: string) {
    this.service.noteChange(row, value);
  }

}
