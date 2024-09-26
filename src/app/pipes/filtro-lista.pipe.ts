import { Pipe, PipeTransform } from "@angular/core";
import { MovimentacaoAtivo } from "../models/movimentacao-ativo";

@Pipe({
    name: "filtroLista",
    pure: false
})
export class FiltroListaPipe implements PipeTransform{
    transform(lista: any[], filtroFn: (valor: any, filtro: any) => boolean, filtroValue: any) : MovimentacaoAtivo[] | undefined{
        if(!lista) return;
        if(!filtroValue) return lista;

        return lista.filter(item => filtroFn(item, filtroValue));
    }

}