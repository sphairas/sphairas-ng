import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { ConventionsService } from 'src/app/conventions.service';
import { FilesService } from 'src/app/files.service';
import { PrintService } from 'src/app/print.service';
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

    let columns: any[] = [{ id: 'name', name: 'Schüler/Schülerin' }, ...data.keys, { id: 'note', name: 'Bemerkung' }];
    columns.forEach(c => {
      if (!c.name) c.name = c.id;
      if (c.id !== 'name' && c.id !== 'note') c.orientation = 'vertical';
    });
    let rows: Promise<any>[] = data.students.map(s => {
      let all: Promise<any>[] = data.keys.map(k => {
        return this.resolveGrade(s, k);
      });
      return Promise.all(all).then(scores => {
        return { values: [{ id: s.id, column: 'name', value: s.name }, ...scores] }
      });
    });

    let sheet = {
      header: data.name,
      columns: columns,
      rows: await Promise.all(rows),
      version: data.file
    };
    return this.printing.print(sheet);
  }

  private async resolveGrade(student: any, key: any) {
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

    } else {
      let val = key.values?.find(k => k.id === student.id)?.grade;
      let resolved = this.conventions.label(val) || '---';
      return { column: key.id, value: resolved };
    }
  }

}
