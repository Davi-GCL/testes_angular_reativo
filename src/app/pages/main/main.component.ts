import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MovimentacaoAtivoService } from '../../services/movimentacao-ativo.service';
import { Observable, take, tap } from 'rxjs';
import { MovimentacaoAtivo } from '../../models/movimentacao-ativo';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MovimentacaoAtivoNovo } from '../../models/movimentacao-ativo-novo';
import { Router } from '@angular/router';

import { FiltroListaPipe } from '../../pipes/filtro-lista.pipe';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnChanges{
  modoEdicao: boolean = false;
  filtroSelecionado: any;
  ativosMovimentados$!: Observable<MovimentacaoAtivo[]>;

  movimentacaoAtivoForm!: FormGroup<any>;
  filtroForm!: FormGroup<any>;

  @Input() id?: string;
  
  constructor(
    private movimentacaoAtivoService: MovimentacaoAtivoService,
    private formBuilder: FormBuilder,
    private router: Router
  ){
    this.movimentacaoAtivoForm = formBuilder.group({
      ticker: new FormControl<string>('', [Validators.required, Validators.maxLength(10)]),
      valor: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
      qtd: new FormControl<Number>(0, [Validators.required, Validators.min(0)]),
      dataMovimentacao: new FormControl<Date | null>(null, [this.dataMaiorAtualValidator])
    })

    this.filtroForm = formBuilder.group({
      id: new FormControl<string>(''),
      ticker: new FormControl<string>('', [Validators.maxLength(10)]),
      valor: new FormControl<Number | null>(null),
      qtd: new FormControl<Number | null>(null),
      dataMovimentacao: new FormControl<Date | null>(null, [this.dataMaiorAtualValidator])
    })
  }

  dataMaiorAtualValidator(control: AbstractControl): ValidationErrors | null {
    if(control.value){
      return (Date.parse(control.value) > Date.now())? {dataMaiorAtual: true} : null;
    }
    return null;
  }

  ngOnInit(): void {
    this.ativosMovimentados$ = this.movimentacaoAtivoService.obterMovimentacoesDeAtivos().pipe(tap(value => console.log(value)));
    
    console.log(this.movimentacaoAtivoForm.controls['ticker']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("id: ", this.id);

    if (this.id){
      this.modoEdicao = true;
      this.movimentacaoAtivoService.obterMovimentacaoDeAtivoPeloID(this.id)
        .pipe(take(1))
        .subscribe({
          next: (value) => {
            this.movimentacaoAtivoForm.setValue({    
              ticker: value.ticker,
              valor: value.valor,
              qtd: value.qtd,
              dataMovimentacao: value.dataMovimentacao?? null
            });
          },
          error: (err) => {
            console.error(err);
          },
        })
    }
    else {
      this.modoEdicao = false;
    }
  }
  
  formSubmit(){
    if(!this.movimentacaoAtivoForm.valid){
      console.log(this.movimentacaoAtivoForm.controls)
      return;
    }
    
    let valoresFormulario = this.movimentacaoAtivoForm.value as MovimentacaoAtivoNovo;

    if(this.modoEdicao && this.id) this.editarMovimentacao(valoresFormulario);
    else this.incluirNovaMovimentacao(valoresFormulario);
    
  }

  filtroFormSubmit(){
    if(!this.filtroForm.valid) return;

    console.log(this.filtroForm)

    this.filtroSelecionado = this.filtroForm.value;
  }
  
  editarMovimentacao(movimentacaoAtivoNovo: MovimentacaoAtivoNovo){
    console.log('Editando');
    this.movimentacaoAtivoService.editarMovimentacaoDeAtivo(this.id!, movimentacaoAtivoNovo)
      .pipe(take(1))
      .subscribe(_ => this.ativosMovimentados$ = this.movimentacaoAtivoService.obterMovimentacoesDeAtivos());
  }

  incluirNovaMovimentacao(movimentacaoAtivoNovo: MovimentacaoAtivoNovo){
    this.movimentacaoAtivoService.incluirNovaMovimentacaoDeAtivo(movimentacaoAtivoNovo)
      .pipe(take(1))
      .subscribe(_ => this.ativosMovimentados$ = this.movimentacaoAtivoService.obterMovimentacoesDeAtivos());
  }

  excluirMovimentacao(id: string){
    let confirmado = window.confirm("Tem certeza que você quer excluir o seguinte registro de movimentação?\nIdentificador: " + id); 
    
    if (!confirmado) return;

    this.movimentacaoAtivoService.removerMovimentacaoDeAtivo(id)
      .pipe(take(1), tap(x => this.ativosMovimentados$ = this.movimentacaoAtivoService.obterMovimentacoesDeAtivos()))
      .subscribe({
        next: (value)=>{
          window.alert(`Registro de id: ${value.id} removido com sucesso!`)
        },
        error: (err) => {
          window.alert("Nao foi possivel excluir esse registro");
        }
      });
  }

  selecionarLinha(id: string)
  {
    let params = {id: id};
    this.router.navigate(["/main", id])
  }

  filtroCallback(valor: MovimentacaoAtivo, filtro: any){

    return ((filtro.dataMovimentacao == null || valor.dataMovimentacao != undefined && filtro.dataMovimentacao <= valor.dataMovimentacao) && 
    (filtro.valor == null || filtro.valor == valor.valor) && 
    (filtro.qtd == null || filtro.qtd == valor.qtd) && 
    (filtro.ticker == null || valor.ticker.includes(filtro.ticker)));

    // if(filtro.dataMovimentacao && filtro.valor && filtro.qtd && filtro.ticker) 
    //     return filtro.dataMovimentacao == valor.dataMovimentacao && filtro.valor == valor.valor && filtro.qtd == valor.qtd && filtro.ticker == valor.ticker;

    // if(filtro.dataMovimentacao) valor.dataMovimentacao == filtro.dataMovimentacao;
    // if(filtro.valor) return valor.valor == filtro.valor;
    // if(filtro.qtd) return valor.qtd == filtro.qtd;
    // if(filtro.ticker) return valor.ticker.includes(filtro.ticker);
    // return false;
  }
}
