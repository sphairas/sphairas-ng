import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { PrintService } from 'src/app/print.service';
import { RecordsSheetService } from './records-sheet.service';
import { ConventionsService } from 'src/app/conventions.service';

@Component({
  selector: 'records-sheet-export-pdf',
  template: '<button type="button" pButton pRipple icon="pi pi-file-pdf" (click)="export()" class="p-button-warning p-mr-2" pTooltip="PDF" tooltipPosition="bottom"></button>',
  styles: [""]
})
export class ExportRecordsPdfComponent implements OnInit {

  constructor(private service: RecordsSheetService, private printing: PrintService, private conventions: ConventionsService) { }

  ngOnInit(): void {
  }

  export(): void {
    this.service.recdata.pipe(take(1)).subscribe(d => this.doExportPdf(d));
  }

  private async doExportPdf(data: { columns: any, rows: any }) {

    let jcols: any[] = [{ id: 'record', name: 'Stunde' }, { id: 'text', name: 'Thema' }, { id: 'weight', name: 'Gewicht' }];
    let jrows: { values: [{ id: string, column: string, value: string }] }[] = data.rows.map(r => {
      return {
        values: [{ column: 'record', value: this.formatRowTime(r) },
        { column: 'text', value: r.journal || '' }]
      };
    });

    let scols: any[] = [{ id: 'record', name: 'Stunde' }, ...data.columns]; //TODO: remove spread operator
    let srows: { values: [{ id: string, column: string, value: string }] }[] = data.rows.map(r => {
      let scores = [];
      data.columns.forEach(c => {
        let g = r.records[c.id]?.id;
        if (g) {
          let svg = this.conventions.iconEncoded(g);
          if (svg) {
            scores.push({ column: c.id, type: 'image', value: svg });
          }
          else scores.push({ column: c.id, value: this.conventions.label(g) });
        }
      });
      return {
        values: [{ column: 'record', value: this.formatRowTime(r) }, ...scores]
      };
    });

    let file: any = await this.service.data.pipe(take(1)).toPromise();
    let journal = {
      header: file.name,
      columns: jcols,
      rows: jrows,
      version: file.file,
    };
    let sheet = {
      header: file.name,
      columns: scols,
      rows: srows,
      version: file.file,
      legend: 'Legende: f: fehlend, e: entschuldigt'
    };
    return this.printing.print({ journal: journal, sheet: sheet }, 'journal');
  }

  private formatRowTime(r: any) {
    if (r.period) return r.time.locale('de').format('dd., D. MMM').concat(', ' + r.period + '. Stunde');
    else return r.time.locale('de').format('dd., D. MMM, H:mm');
  }
}
