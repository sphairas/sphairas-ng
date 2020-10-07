import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { GradeValue } from '../gradevalue';
import { SelectItem } from 'primeng/api';
import { ConventionsService } from 'src/app/conventions.service';

export interface SelectGrade extends SelectItem {
  value: string,
  label: string,
  icon: string
}

@Component({
  selector: 'grade-editor',
  templateUrl: './gradeeditor.component.html',
  styleUrls: ['./gradeeditor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GradeEditorComponent implements OnInit {

  //@Input()
  grades: SelectGrade[] = [];
  _value: GradeValue;
  @Output() 
  valueChange: EventEmitter<GradeValue> = new EventEmitter<GradeValue>();
  @Input()
  treeTable: boolean = false;

  constructor(private conventions: ConventionsService) {
    this.grades = ConventionsService.conventions.flatMap(co => {
      let n = co.name;
      return co.grades.map(go => <SelectGrade>{ 
        value: go.id,
        label: go.label,
        icon: this.conventions.icon(go.id) 
      });
    });
  }

  ngOnInit(): void {
  }

  get value(): GradeValue {
    return this._value;
  }

  @Input()
  set value(v: GradeValue) {
    this._value = v;
  }

  get current(): string {
    let item = this.currentItem;
    return item ? item.value : this.value.id;
  }

  set current(selected: string) {
    this.value.id = selected;
    this.valueChange.emit(this.value);
  }

  get currentItem(): SelectGrade {
    let ret = this.grades.find(g => this.value && g.value === this.value.id);
   if(ret) console.log(ret.icon)
    return ret;
  }
}
