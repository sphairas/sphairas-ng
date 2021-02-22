import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { FilesService } from 'src/app/files.service';

@Component({
  selector: 'referenced-value',
  template: "{{data | async | displayGrade}}",
  styles: [""]
})
export class ReferencedValueComponent implements OnInit {

  @Input()
  ref: { doc: string, id: string };
  @Input()
  student: string;
  data: Observable<any>;
  text: string;

  constructor(private files: FilesService) {
  }

  ngOnInit(): void {
    this.data = this.files.file(this.ref.doc).pipe(
      tap(t => {if(!t) console.log("NO T")}),
      map(f => { return this.findValue(f) }),
      tap(t => this.text = 'FOUND' + JSON.stringify(t)),
      shareReplay(1)//Does the magic to update without cdr.detectChanges();
    );
  }

 findValue(data: any): string {
    console.log(JSON.stringify(this.ref) + ' ' + this.student)
    let record = data.records.find(r => r.id === this.student);
    console.log(JSON.stringify(record));
    return record ? record.grade : '???';
  }
}
