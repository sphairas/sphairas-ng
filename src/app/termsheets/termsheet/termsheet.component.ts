import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordsService } from 'src/app/records.service';
import { GradeValue } from '../gradevalue';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-termsheet',
  templateUrl: './termsheet.component.html',
  styleUrls: ['./termsheet.component.scss']
})
export class TermsheetComponent implements OnInit {

  public document: string;
  doc2$: Observable<string>;
  unit: string;
  recdata: any[] = [];
  reccols: any[] = [];
  sub: Subscription;
  @ViewChild('recTable') table: Table;


  constructor(private route: ActivatedRoute, private service: RecordsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.document = this.route.snapshot.paramMap.get('document');
    this.doc2$ = this.route.paramMap.pipe(
      map(p => p.get('document'))
    );
    this.unit = 'doc:kgs-physik-abitur2022-en1';
    this.sub = this.service.recordsView(this.unit).subscribe(res => {
      this.reccols = res.columns;
      res.rows.sort((r1, r2) => r1.fullname.localeCompare(r2.fullname));
      this.recdata = res.rows;
      //https://github.com/primefaces/primeng/issues/2219
      //https://github.com/primefaces/primeng/issues/2689
      //this.recdata = [...this.recdata];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  gradeChange(rec: string, stud: string, val: GradeValue) {
    if (val && val.id) this.service.setGrade(rec, stud, val.id);
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
}
