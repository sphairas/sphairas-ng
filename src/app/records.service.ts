import { Injectable } from '@angular/core';
import { PouchDBService } from './pouchdb.service';
import { from, merge, Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { GradeValue } from './types/gradevalue';
import { Moment } from 'moment';
import { ConventionsService } from './conventions.service';
import { switchMap } from 'rxjs/operators';

const VIEW_TIMESUNITS = 'times/times-units';
const VIEW_TIMESUNIT_STUDENTS = 'times/times-unitstudents';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private db: PouchDBService) {
  }

  private async unit(options: { start: string, end: string; unit: string }): Promise<any[]> {//, start: Moment = utc().startOf('day').subtract(14, 'days'), end: Moment = utc().endOf('day').add(5, 'days')) {
    //let s = '202008010000'; //start.format('YYYYMMDDHHmm');
    //let e = '202010120000'; //end.format('YYYYMMDDHHmm');
    let opt = {
      //include_docs: true,
      attachments: false,
      startkey: [options.unit, options.start],
      endkey: [options.unit, options.end]
    };
    return this.db.query(VIEW_TIMESUNITS, opt)
      .then(res => {
        return res.rows
          .map(r => { return { "time": r.key[1], "id": r.id, "records": r.value.records, "value": r.value } });
        // for (let i = 0; i < res.rows.length; i++) {
        //   let d = res.rows[i].doc;
        //   let k = res.rows[i].key;
        //   let v = res.rows[i].value;
        //   console.log(d + ' ' + k + ' ' + v);
        // }
        // return [];
      })
      // .then(recs => this._records.next(List(recs)))
      .catch(err => console.log(err));
  }

  private async students(unit: string) {
    let options = {
      //include_docs: true,
      attachments: false,
      key: unit
    };
    return this.db.query(VIEW_TIMESUNIT_STUDENTS, options)
      .then(res => {
        if (res.rows.length > 0) {
          let ret = {
            'unit-name': res.rows[0].value.name,
            students: res.rows[0].value.students
          };
          return ret;
        }
        return undefined;
      })
      .catch(err => console.log(err));
  }

  // recordsView(unit: string): Observable<{ columns: any, rows: any }> {
  //   let ret: Subject<any> = new Subject();
  //   let reload = () => {
  //     let records = this.unit(unit);
  //     let students = this.students(unit);
  //     Promise.all([students, records])
  //       .then(([unitdata, recs]: [any, any[]]) => {
  //         let columns = recs.map(c => { return { field: c.time, id: c.id, period: c.period, time: moment(c.time, 'YYYYMMDDhhmm') } });
  //         let map = [];
  //         recs.forEach(r => {
  //           let t = r.time;
  //           let rr: any[] = r.records;
  //           if (rr) {
  //             rr.forEach(sr => {
  //               let sid = sr.student;
  //               let g = sr.grade;
  //               if (!map[sid]) map[sid] = {};
  //               if (g) {
  //                 let entry: GradeValue = {
  //                   id: g,
  //                   editable: true,
  //                   timestamp: sr.timestamp
  //                 }
  //                 map[sid][t] = entry;
  //               }
  //             });
  //           }
  //         });
  //         let rows: any[] = [];
  //         for (var sid in map) {
  //           let name = unitdata?.students.find(s => s.id === sid)?.name || sid;
  //           let row = {
  //             student: sid,
  //             fullname: name
  //           }
  //           for (var entry in map[sid]) {
  //             row[entry] = map[sid][entry];
  //           }
  //           rows.push(row);
  //         }
  //         //rows.sort((r1, r2) => r1.fullname.localeCompare(r2.fullname));
  //         return { columns: columns, rows: rows };
  //       })
  //       .then(res => ret.next(res));
  //   }
  //   this.db.eventHandler.subscribe(e => {
  //     //if (e.type === 'change' && e.docs.find(doc => doc._id === ????)) {  //check time, not unit
  //     reload();
  //     //}
  //   });
  //   reload();
  //   return ret;
  // }

  recordsView(options: { start: string, end: string; unit: string }): Observable<{ columns: any, rows: any }> {
    let load = async () => {
      let records = this.unit(options);
      let students = this.students(options.unit);
      return Promise.all([students, records])
        .then(([unitdata, recs]: [any, any[]]) => {
          let columns: any[] = unitdata.students.map(s => { return { field: s.id, id: s.id, name: s.name } });
          columns.sort((r1, r2) => r1.name.localeCompare(r2.name));
          //let columns = recs.map(c => { return { field: c.time, id: c.id, period: c.period, time: moment(c.time, 'YYYYMMDDhhmm') } });
          let rows: any[] = recs.map(rrow => {
            let map = [];
            rrow.value.records.forEach(sr => {
              let sid = sr.student;
              let g = sr.grade;
              if (g) {
                if (!map[sid]) map[sid] = {};
                //Workaround, remove
                if (g.indexOf('#') === -1) {
                  if (g === 'f' || g === 'e') {
                    g = 'anwesenheit#' + g;
                  } else
                    g = ConventionsService.defaultConvention + '#' + g;
                }
                let entry: GradeValue = {
                  id: g,
                  editable: true,
                  timestamp: sr.timestamp
                }
                map[sid] = entry;
              }
              // else {
              //   let entry: GradeValue = {
              //     id: 'niedersachsen.ersatzeintrag#pending',
              //     editable: true
              //   }
              //   map[sid] = entry;
              // }
            });
            //Workaround, remove create pending entries for all
            unitdata.students.forEach(s => {
              let sid = s.id;
              if (!map[sid]) {
                let entry: GradeValue = {
                  id: 'niedersachsen.ersatzeintrag#pending',
                  editable: true
                }
                map[sid] = entry;
              }
            });
            let ret: { id: string, period: number, categories: string, time: Moment, records: any[], journal: string } = { id: rrow.id, period: rrow.value.period, categories: rrow.value.categories, time: moment(rrow.time, 'YYYYMMDDhhmm'), records: map, journal: rrow.value.journal };
            return ret;
          });
          return { columns: columns, rows: rows };
        });
    }
    // this.db.eventHandler.subscribe(e => {
    //   //if (e.type === 'change' && e.docs.find(doc => doc._id === ????)) {  //check time, not unit
    //   load();
    //   //}
    // });
    // load();
    // //  return ret;  

    let res: Observable<any> = from(load());
    let timesChanges: Observable<any> = this.db.viewChanges(VIEW_TIMESUNITS).pipe(
      //filter(c => c.id === doc),
      switchMap(() => from(load())),
    );
    let studChanges: Observable<any> = this.db.viewChanges(VIEW_TIMESUNIT_STUDENTS).pipe(
      //filter(c => c.id === doc),
      switchMap(() => from(load())),
    );
    return merge(res, timesChanges, studChanges);
  }

  async setGrade(rec: string, student: string, grade: string) {
    const cb = (doc: any): void => {
      if (!doc.records) doc.records = [];
      let i = 0;
      for (; i < doc.records.length; i++) {
        let record: { student: string, grade: string, timestamp: number } = doc.records[i];
        if (record.student === student) {
          record.grade = grade;
          record.timestamp = Date.now();
          return;
        }
      }
      let record: { student: string, grade: string, timestamp: number } = {
        student: student,
        grade: grade,
        timestamp: Date.now()
      };
      doc.records.push(record);
    };
    return this.db.change(rec, cb)
      .then(res => {
        //this.loadInitialData();
        return res;
      });
  }

}
