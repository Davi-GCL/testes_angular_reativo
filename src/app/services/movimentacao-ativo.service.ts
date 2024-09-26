import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MovimentacaoAtivo } from '../models/movimentacao-ativo';
import { Observable } from 'rxjs';
import { MovimentacaoAtivoNovo } from '../models/movimentacao-ativo-novo';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoAtivoService {
  private readonly URL = `${environment.api}/movimentacao-ativo`;

  private readonly HTTP: HttpClient = inject(HttpClient);

  obterMovimentacoesDeAtivos(): Observable<MovimentacaoAtivo[]>{
    return this.HTTP.get<MovimentacaoAtivo[]>(this.URL);
  }

  obterMovimentacaoDeAtivoPeloID(id: string): Observable<MovimentacaoAtivo>{
    return this.HTTP.get<MovimentacaoAtivo>(`${this.URL}/${id}`);
  }

  incluirNovaMovimentacaoDeAtivo(novo: MovimentacaoAtivoNovo): Observable<any>{
    if (!novo.dataMovimentacao) novo.dataMovimentacao = new Date();

    return this.HTTP.post<MovimentacaoAtivoNovo>(this.URL, novo);
  }

  editarMovimentacaoDeAtivo(id: string, editado: MovimentacaoAtivoNovo): Observable<any>{
    let movimentacaoAtualizada: MovimentacaoAtivoNovo = editado;

    console.log(movimentacaoAtualizada);

    return this.HTTP.put<MovimentacaoAtivoNovo>(`${this.URL}/${id}`, movimentacaoAtualizada);
  }

  removerMovimentacaoDeAtivo(id: string): Observable<any>{
    return this.HTTP.delete(`${this.URL}/${id}`);
  }
}
