import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { RecordsService } from 'src/app/records.service';
import { GradeValue } from 'src/app/types/gradevalue';
import * as _ from 'lodash';
declare let $: any;

@Component({
  selector: 'app-records-sheet',
  templateUrl: './records-sheet.component.html',
  styleUrls: ['./records-sheet.component.scss']
})
export class RecordsSheetComponent implements OnInit, AfterViewChecked {

  @Input()
  file: string;
  data: Observable<any>;
  _files_doc_rev: string;
  recsettings: { start: string, end: string; unit: string };
  recdata: Observable<{ columns: any, rows: any }>;
  statistics: { value: number, count: number, mean: number }[];

  @ViewChild('frozenHeaderRow', { read: ElementRef, static: false }) frozenHeaderRow: ElementRef;
  @ViewChild('scrollableHeaderRow') scrollableHeaderRow: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private files: FilesService, private records: RecordsService, private conventions: ConventionsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    if (!this.file) this.file = this.activatedRoute.snapshot.paramMap.get('file');
    this.data = this.files.file(this.file).pipe(
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

  ngOnDestroy(): void {
    //if (this.sub) this.sub.unsubscribe();
  }


  ngAfterViewChecked() {
    if (this.scrollableHeaderRow && this.frozenHeaderRow) {
      let sh = this.scrollableHeaderRow.nativeElement.offsetHeight; //.clientHeight ?
      this.frozenHeaderRow.nativeElement.style.height = sh + 'px';
    }
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

  gradeChange(rec: string, stud: string, val: GradeValue) {
    if (val && val.id) this.records.setGrade(rec, stud, val.id);
  }

  /*   exportPdf() {
      import("jspdf").then(jsPDF => {
          import("jspdf-autotable").then(x => {
              const doc = new jsPDF.default(0,0);
              doc.autoTable(this.exportColumns, this.products);
              doc.save('products.pdf');
          })
      })
  }
  
  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.products);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "products");
      });
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  } */

  truncate(text: string, max: number) {
    if (max <= 4 || text.length <= max) { return text; }
    let ret: string = text.substr(0, max - 3);
    const rgx = /\s/g;
    rgx.test(ret);
    let li: number = rgx.lastIndex;
    if (li !== 0 && max - li < 8) ret = ret.substring(0, li);
    return `${ret} …`;
  };

}
