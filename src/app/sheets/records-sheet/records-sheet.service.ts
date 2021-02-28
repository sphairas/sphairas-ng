import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { RecordsService } from 'src/app/records.service';

@Injectable()
export class RecordsSheetService {

  file: string;
  data: Observable<any>;
  private unfiltered: Observable<any>;
  private _files_doc_rev: string;
  private recsettings: { start: string, end: string; unit: string };
  recdata: Observable<{ columns: any, rows: any }>;
  statistics: { value: number, count: number, mean: number }[];

  constructor(private files: FilesService, private records: RecordsService, private conventions: ConventionsService) { }

  setCurrent(file: string) {
    this.file = file;
    this._files_doc_rev = undefined;
    this.unfiltered = this.files.file(this.file);
    this.data = this.unfiltered.pipe(
      filter(t => !this._files_doc_rev || this._files_doc_rev !== t._rev),
      tap(t => {
        this._files_doc_rev = t._rev;
        let s = { start: t.start, end: t.end, unit: t.unit };
        if (!_.isEqual(this.recsettings, s)) {
          this.recsettings = s;
          this.recdata = this.records.recordsView(this.recsettings).pipe(
            tap(r => {
              this.statistics = this.sdev(r.rows);
            })
          );
          // .subscribe(res => {
          //   this.reccols2 = res.columns;
          //   this.recdata2 = res.rows;
          //   this.statistics = this.sdev(this.recdata2);
          //   //https://github.com/primefaces/primeng/issues/2219
          //   //https://github.com/primefaces/primeng/issues/2689
          //   //this.recdata = [...this.recdata];
          //   this.cdr.detectChanges();
          // });
        }
      }),
      shareReplay(1)//Does the magic to update without cdr.detectChanges();
    );
  }

  private sdev(rows: any[]): { value: number, count: number, mean: number }[] {
    const stats = require('wink-statistics');
    const stdev = stats.streaming.stdev();
    let students: { sum: any, wsum: any, mean: any }[] = [];
    rows.forEach(r => {
      stdev.reset();
      for (var sid in r.records) { 
        let rec = r.records[sid];
        if (rec.id) {
          let v: number = this.conventions.numerical(rec.id);
          if (v) {
            stdev.compute(v);
          }
        }
      }
      let res = stdev.result();
      let sd = res.stdevp;
      if (res.size !== 0 && sd !== 0) {
        let out: string = `${r.id}: ${sd}, size: ${res.size}, mean: ${res.mean})`;
        console.log(out);
        //
        for (var sid in r.records) {
          if (!students[sid]) {
            students[sid] = {
              sum: stats.streaming.sum(),
              wsum: stats.streaming.sum(),
              mean: stats.streaming.mean()
            }
          }
          let rec = r.records[sid];
          if (rec.id) {
            let v: number = this.conventions.numerical(rec.id);
            if (v) {
              let sData = students[sid];
              let weighted = v * sd;
              sData.sum.compute(weighted);
              sData.wsum.compute(sd);
              sData.mean.compute(v);
            }
          }
        }
      }
    });
    //
    let ret: { value: number, count: number, mean: number }[] = [];
    for (var sid in students) {
      let sData = students[sid];
      let sum = sData.sum.value();
      let wsum = sData.wsum.value();
      let m = sData.mean.result();
      if (sum !== 0) {
        ret[sid] = {
          value: sum / wsum,
          count: m.size,
          mean: m.mean
        }
      }
      //let out: string = `${sid}: ${result}`;
      //console.log(out);
    }
    return ret;
  }
}
