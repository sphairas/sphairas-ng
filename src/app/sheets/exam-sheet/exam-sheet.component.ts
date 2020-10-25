import { Component, Input, OnInit } from '@angular/core';
import { PouchDBService } from 'src/app/pouchdb.service';
import { GradeValue } from 'src/app/termsheets/gradevalue';

@Component({
  selector: 'app-exam-sheet',
  templateUrl: './exam-sheet.component.html',
  styleUrls: ['./exam-sheet.component.scss']
})
export class ExamSheetComponent implements OnInit {

  @Input()
  file: string;
  data: { grade: string, records: number[], id: string, name: string }[];
  keys: { id: string, name: string, "max-value": number, weight: number }[];
  distribution: { floor: number, grade: string }[] = [];

  readonly stats = require('wink-statistics');

  constructor(private db: PouchDBService) { }

  ngOnInit(): void {
    this.db.find(this.file)
      .then(r => {
        this.data = r.records;
        this.keys = r.keys;
        this.distribution = r.distribution;
      });
  }

  distribute(sum: number): string {
    let i = this.distribution.length;
    while (--i >= 0) {
      if (sum >= this.distribution[i].floor) return this.distribution[i].grade;
    }
    return undefined;
  }

  gradeChange(stud: string, val: GradeValue) {
    if (val && val.id) {
      this.db.change(this.file, d => {
        let entry = d.records.find(r => r.id === stud);
        if (entry) {
          entry.grade = val.id;
        }
        return d;
      });
    }
  }

  sum(row: { grade: string, records: number[], id: string, name: string }): number {
    let s = this.stats.streaming.sum();
    for (var key in row.records) {
      let val: number = row.records[key];
      s.compute(val);
    }
    return s.value();
  }

}
