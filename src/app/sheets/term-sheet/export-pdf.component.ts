import { Component, OnInit } from '@angular/core';
import { filter, map, take, tap } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { PrintService } from 'src/app/print.service';
import { weightedSum } from './average-value.component';
import { ReferencedValueComponent } from './referenced-value.component';
import { TermSheetService } from './term-sheet.service';

//pi-file-o für CSV
@Component({
  selector: 'term-sheet-export-pdf',
  template: '<button type="button" pButton pRipple icon="pi pi-file-pdf" (click)="export()" class="p-button-warning p-mr-2" pTooltip="PDF" tooltipPosition="bottom"></button>',
  styles: [""]
})
export class ExportPdfComponent implements OnInit {

  constructor(private service: TermSheetService, private printing: PrintService, private conventions: ConventionsService, private files: FilesService) { }

  ngOnInit(): void {
  }

  export(): void {
    this.service.data.pipe(take(1)).subscribe(d => this.doExportPdf(d));
  }

  private async doExportPdf(data: any) {

    let columns: any[] = [{ id: 'name', name: 'Schüler/Schülerin' }, ...data.keys, { id: 'note', name: 'Bemerkung' }]; //TODO: remove spread operator, security
    columns.forEach(c => {
      if (!c.name) c.name = c.id;
      if (c.id !== 'name' && c.id !== 'note') c.orientation = 'vertical';
    });
    let rows: Promise<any>[] = data.students.map(s => {
      let all: Promise<any>[] = data.keys.map(k => this.resolveGrade(s, k, data));
      return Promise.all(all).then(scores => {
        let ret = { values: [{ id: s.id, column: 'name', value: s.name }, ...scores] }
        let n = data.notes?.find(n => n.student === s.id)?.text;
        if (n) ret.values.push({ column: 'note', value: n });
        return ret;
      });
    });

    let sheet = {
      header: data.name,
      columns: columns,
      rows: await Promise.all(rows),
      version: data.file,
      footnotes: []
    };

    let index: number = 1;
    columns.forEach(c => {
      if (c.function && c.function.type === 'average') {
        let f: { type: string, references: { 'referenced-key': string, weight: number }[] } = c.function;
        let text = f.references.map(r => columns.find(c => c.id === r['referenced-key']).name + ": " + (r.weight * 100).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "%").join(", ");
        c.footnotes = [index];
        sheet.footnotes.push({ id: index++, value: text });
      }
    });
    return this.printing.print(sheet);
  }

  private async resolveGrade(student: any, key: any, data: any) {
    if (key['sheet-document-reference']) {
      let ref: { doc: string, id: string } = key['sheet-document-reference'];
      return this.files.file(ref.doc).pipe(
        map(f => { return ReferencedValueComponent.findValue(f, student.id) }),
        map(val => { return this.conventions.label(val) || '---' }),
        take(1)
      ).toPromise().then(resolved => {
        return { column: key.id, value: resolved }
      });
    } else if (key.function && key.function.type === 'average') {
      //Wird nicht aufgelöst
      return this.service.initAverage(data, key.function, student, (arr: { grade: string, weight: number }[]) => weightedSum(arr, (grade: string) => this.conventions.numerical(grade))).pipe(
        filter<number>(Boolean),
        take(1)
      ).toPromise().then(avg => {
        console.log(avg);
        return { column: key.id, value: avg?.toLocaleString('de-DE', { maximumFractionDigits: 2 }) };
      });
    } else {
      let val = key.values?.find(k => k.id === student.id)?.grade;
      let resolved = this.conventions.label(val) || '---';
      return { column: key.id, value: resolved };
    }
  }

}
