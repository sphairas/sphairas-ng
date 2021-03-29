import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordsService } from 'src/app/records.service';
import { GradeValue } from 'src/app/types/gradevalue';
import * as _ from 'lodash';
import { RecordsSheetService } from './records-sheet.service';
import { MenuItem } from 'primeng/api';
//declare let $: any;

@Component({
  selector: 'app-records-sheet',
  templateUrl: './records-sheet.component.html',
  styleUrls: ['./records-sheet.component.scss'],
  providers: [RecordsSheetService]
})
export class RecordsSheetComponent implements OnInit, AfterViewChecked {

  file: string;

  @ViewChild('frozenHeaderRow', { read: ElementRef, static: false }) frozenHeaderRow: ElementRef;
  @ViewChild('scrollableHeaderRow') scrollableHeaderRow: ElementRef;
  @ViewChildren('frozenRow') frozenRows: QueryList<ElementRef>;
  @ViewChildren('scrollableRow') scrollableRows: QueryList<ElementRef>;
  @ViewChildren('frozenFooter') frozenFooters: QueryList<ElementRef>;
  @ViewChildren('scrollableFooter') scrollableFooters: QueryList<ElementRef>;

  frozenWidth: string;

  selectedRow: any;
  context: MenuItem[];

  constructor(private activatedRoute: ActivatedRoute, public service: RecordsSheetService, private records: RecordsService) {
    this.activatedRoute.paramMap.subscribe(() => this.ngOnInit());
    this.setFrozenWidth();
  }

  ngOnInit(): void {
    let routed = this.activatedRoute.snapshot.paramMap.get('file');
    if (this.file === routed) return;
    this.file = routed;
    this.service.setCurrent(this.file);

    this.context = [
      { label: 'Alle Entfall', icon: 'pi pi-fw pi-ellipsis-h', command: () => this.setAllEntfall() }
    ];
  }

  private setAllEntfall() {
    let studs: string[] = Object.keys(this.selectedRow.records);
    this.records.replaceGrade(this.selectedRow.id, studs, 'niedersachsen.ersatzeintrag#pending', true, 'mitarbeit#entfall');
  }

  ngOnDestroy(): void {
    //if (this.sub) this.sub.unsubscribe();
  }


  ngAfterViewChecked() {
    //setTimeout(() => {
    let t = this.scrollableHeaderRow.nativeElement;
    let height = (<HTMLElement>t).getBoundingClientRect().height
    this.frozenHeaderRow.nativeElement.style.height = height + 'px';
    let fee: ElementRef[] = this.frozenRows.toArray();
    let see: ElementRef[] = this.scrollableRows.toArray();
    for (let row: number = 0; row < fee.length; row++) {
      let t = fee[row].nativeElement;
      // let sh: number = fee[row].nativeElement.offsetHeight;
      // let ch: number = fee[row].nativeElement.clientHeight;
      let height = (<HTMLElement>t).getBoundingClientRect().height
      see[row].nativeElement.style.height = height + 'px';
    }
    let ffe: ElementRef[] = this.frozenFooters.toArray();
    let sfe: ElementRef[] = this.scrollableFooters.toArray();
    for (let row: number = 0; row < ffe.length; row++) {
      let t = ffe[row].nativeElement;
      let height = (<HTMLElement>t).getBoundingClientRect().height
      sfe[row].nativeElement.style.height = height + 'px';
    }
    //});
    //
    //this.makeRowsSameHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.setFrozenWidth();
  }

  private setFrozenWidth() {
    let width = window.innerWidth;
    if (width < 1000) this.frozenWidth = '50%';
    else this.frozenWidth = '37%'
  }

  //https://stackblitz.com/edit/angular-primeng-table-frozen-columns-dpsm8l?file=src%2Fapp%2Ftable-scroll-demo.component.ts
  // makeRowsSameHeight() {
  //   setTimeout(() => {
  //     if ($('.ui-table-scrollable-wrapper').length) {
  //       let wrapper = $('.ui-table-scrollable-wrapper');
  //       wrapper.each(function () {
  //         let w = $(this);
  //         let frozen_rows: any = w.find('.ui-table-frozen-view tr');
  //         let unfrozen_rows = w.find('.ui-table-unfrozen-view tr');
  //         for (let i = 0; i < frozen_rows.length; i++) {
  //           if (frozen_rows.eq(i).height() > unfrozen_rows.eq(i).height()) {
  //             unfrozen_rows.eq(i).height(frozen_rows.eq(i).height());
  //           } else if (frozen_rows.eq(i).height() < unfrozen_rows.eq(i).height()) {
  //             frozen_rows.eq(i).height(unfrozen_rows.eq(i).height());
  //           }
  //         }
  //       });
  //     }
  //   });
  //}

  get recdata() {
    return this.service.recdata;
  }

  get statistics() {
    return this.service.statistics;
  }

  journalChange(row: any, value: string) {
    if (row.journal === value) return;
    this.service.journalChange(row.id, value);
  }

  gradeChange(rec: string, stud: string, val: GradeValue) {
    if (val && val.id) this.records.setGrade(rec, stud, val.id);
  }

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
