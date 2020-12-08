import { Injectable } from '@angular/core';
import { from, merge, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private db: PouchDBService) {
  }

  files(): Observable<{ id: string, key: string, value: any }[]> {
    let options = {
      attachments: false
    };
    let load = async () => {
      return this.db.query('config/files', options)
        .then(res => {
          return res.rows;
        })
        .catch(err => console.log(err));
    }
    let res: Observable<{ id: string, key: string, value: any }[]> = from(load());
    let changes: Observable<{ id: string, key: string, value: any }[]> = this.db.changes.pipe(
      filter(c => c.id.indexOf('file:') === 0),
      switchMap(() => from(load()))
    );
    return merge(res, changes);
  }

  file(file: string): Observable<any> {
    let doc = `file:${file}`;
    let options = {
      include_docs: true,
      attachments: false
    };
    let load = async () => {
      return this.db.find(doc, options)
        .catch(err => console.log(err));
    }
    let res: Observable<any> = from(load());
    let changes: Observable<any> = this.db.changes.pipe(
      filter(c => c.id === doc),
      switchMap(() => from(load())),
      //startWith(undefined)
    );
    return merge(res, changes);
  }

  updateScore(file: string, student: string, key: string, value: number): Observable<any> {
    let doc = `file:${file}`;
    let ret = this.db.change(doc, d => {
      let entry = d.records.find(r => r.id === student);
      if (entry && entry.records) {
        entry.records[key] = value;
      }
      return d;
    });
    return from(ret);
  }

  updateGrade(file: string, student: string, value: string): Observable<any> {
    let doc = `file:${file}`;
    let ret = this.db.change(doc, d => {
      let entry = d.records.find(r => r.id === student);
      if (entry && entry.grade) {
        entry.grade = value;
      }
      return d;
    });
    return from(ret);
  }

  updateNote(file: string, student: string, note: string): Observable<any> {
    let doc = `file:${file}`;
    let ret = this.db.change(doc, d => {
      let entry = d.records.find(r => r.id === student);
      if (entry && entry.records) {
        entry.note = note;
      }
      return d;
    });
    return from(ret);
  }

  updateKeyAndDistribution(file: string, key: { id: string, name?: string, 'max-value'?: number, weight?: number }, dist: { grade: string, floor: number }[], removeKey?: string) {
    let doc = `file:${file}`;
    let ret = this.db.change(doc, d => {
      if (key) {
        let entry = d.keys.find(k => k.id === key.id);
        if (entry) {//update existing
          if (key['max-value']) entry['max-value'] = key['max-value'];
          if (key.weight) entry.weight = key.weight;
          if (key.name) entry.name = key.name;
        } else {//create new
          d.keys.push(key);
          d.records.forEach(r => {
            if (!r.records) r.records = [];
            r.records[key.id] = 0;
          });
        }
      }
      if (dist) {
        dist.forEach(e => {
          let entry = d.distribution.find(k => k.grade === e.grade);
          if (entry && entry.floor !== e.floor) {//update existing
            entry.floor = e.floor;
          }//do nothing if not existing, entries are sorted by grade values
        });
      }
      if (removeKey) {
        let i: number = d.keys.findIndex(k => k.id === key);
        if (i !== -1) {
          d.keys.splice(i, 1);
        }
        d.records.forEach(r => {
          if (r.records) {
            delete r.records[removeKey];
          }
        });
      }
      return d;
    });
    return from(ret);
  }

}
