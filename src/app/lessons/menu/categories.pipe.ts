import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categories'
})
export class CategoriesPipe implements PipeTransform {

  transform(value: any[], ...args: string[]): unknown {
    return value.filter(c => c.category === args[0]);
  }

}
