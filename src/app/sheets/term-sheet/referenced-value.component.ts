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

  constructor(private files: FilesService) {
  }

  ngOnInit(): void {
    this.data = this.files.file(this.ref.doc).pipe(
      map(f => { return ReferencedValueComponent.findValue(f, this.student) }),
      shareReplay(1)//Does the magic to update without cdr.detectChanges();
    );
  }

  public static findValue(file: any, student: string): string {
    let record = file.records.find(r => r.id === student);
    return record ? record.grade : '---';
  }

}
