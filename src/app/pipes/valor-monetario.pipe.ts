import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valorMonetario',
  standalone: true
})
export class ValorMonetarioPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    let valorFormatado: string;



    return null;
  }

}
