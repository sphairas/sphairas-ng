import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { TermSheetService } from './term-sheet.service';

export function weightedSum(arr: { grade: string, weight: number }[], convert: (grade: string) => number): number {
  let s = AverageValueComponent.stats.streaming.sum();
  arr.forEach(e => {
    let n: number = convert(e?.grade);
    if (n) s.compute(n * e.weight);
  });
  return s.value();
}

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

  constructor(private conventions: ConventionsService, private service: TermSheetService) { }

  ngOnInit(): void {
    this.value = this.service.data.pipe(
      switchMap(d => this.service.initAverage(d, this.function, this.student, (arr: { grade: string, weight: number }[]) => weightedSum(arr, (grade: string) => this.conventions.numerical(grade))))
    );
  }

}
