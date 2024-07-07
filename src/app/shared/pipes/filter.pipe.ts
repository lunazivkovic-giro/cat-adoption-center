
import { Pipe, PipeTransform } from '@angular/core';
import { Cat } from '../../models/cat.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(cats: Cat[], searchTerm: string): Cat[] {
    if (!cats || !searchTerm) {
      return cats;
    }
    return cats.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}