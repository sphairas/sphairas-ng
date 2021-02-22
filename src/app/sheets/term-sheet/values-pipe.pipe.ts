import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findGrade'
})
export class ValuesPipe implements PipeTransform {

  transform(value: any, id: string): { id: string, editable: boolean } {
    return { id: value.values.find(v => v.id === id).grade, editable: true };
  }

}
