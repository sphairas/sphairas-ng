import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grades'
})
export class GradesPipe implements PipeTransform {

  transform(rowData: any, col: any): any {
    return rowData.grades.find(g => g['column-ref'] === col.name);
  }

}
