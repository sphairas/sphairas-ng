import { Pipe, PipeTransform } from '@angular/core';
import { ConventionsService } from 'src/app/conventions.service';

@Pipe({
  name: 'displayGrade'
})
export class DisplayGradePipe implements PipeTransform {

  constructor(private conventions: ConventionsService) {
  }

  transform(value: string, ...args: string[]): string {
    //return value;
    return this.conventions.label(value);
  }

}
