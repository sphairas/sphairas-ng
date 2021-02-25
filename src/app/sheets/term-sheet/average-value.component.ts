import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { TermSheetService } from './term-sheet.service';

@Component({
  selector: 'average-value',
  template: "{{value | async | number: '1.0-2'}}",
  styles: [""]
})
export class AverageValueComponent implements OnInit {

  @Input()
  function: { type: string, references: { 'referenced-key': string, weight: number }[] };
  @Input()
  student: string;
  value: Observable<number>;

  static readonly stats = require('wink-statistics');

  constructor(private files: FilesService, private conventions: ConventionsService, private service: TermSheetService) { }

  ngOnInit(): void {
    this.value = this.service.data.pipe(
      switchMap(d => this.initValue(d.keys))
    );
  }

  initValue(keys: any[]): Observable<number> {
    let arr: Observable<{ grade: string, weight: number }>[] = [];
    this.function.references.forEach(r => {
      let key = keys.find(k => k.id === r['referenced-key']);
      if (!key) throw 'Key not found';
      let weight: number = r.weight;
      if (key['sheet-document-reference']) {
        let ref: { doc: string, id: string } = key['sheet-document-reference'];
        arr.push(this.findReference(ref.doc, weight));
      } else { //
        let record = this.service.unfiltered.pipe(
          map(d => d.keys.find(k => k.id === key.id)?.values),
          map(values => values?.find(v => v.id === this.student)),
          filter(value => value && value.grade),
          map(record => { return { grade: record.grade, weight: weight } }),
          shareReplay(1)
        );
        arr.push(record);
        // let record = key.values.find(v => v.id === this.student);
        // if (record) arr.push(of({ grade: record.grade, weight: weight }));
      }
    });
    let grades: Observable<any> = combineLatest(arr);
    return grades.pipe(
      map(res => this.weightedSum(res)),
      shareReplay(1)
    );
  }

  findReference(doc: string, weight: number): Observable<{ grade: string, weight: number }> {
    return this.files.file(doc).pipe(
      map(data => {
        let record = data.records.find(r => r.id === this.student);
        return record ? { grade: record.grade, weight: weight } : undefined;
      }),
      shareReplay(1)//Does the magic to update without cdr.detectChanges(); //??
    );
  }

  weightedSum(arr: { grade: string, weight: number }[]): number {
    let s = AverageValueComponent.stats.streaming.sum();
    arr.forEach(e => {
      let n: number = this.conventions.numerical(e.grade);
      if (n) s.compute(n * e.weight);
    });
    return s.value();
  }

}
