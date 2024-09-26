import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MovimentacaoAtivoService } from '../../services/movimentacao-ativo.service';
import { Observable, take, tap } from 'rxjs';
import { MovimentacaoAtivo } from '../../models/movimentacao-ativo';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MovimentacaoAtivoNovo } from '../../models/movimentacao-ativo-novo';
import { Router } from '@angular/router';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnChanges{
  modoEdicao: boolean = false;
  ativosMovimentados$!: Observable<MovimentacaoAtivo[]>;

  movimentacaoAtivoForm!: FormGroup<any>;

  @Input() id?: string;
  
  constructor(
    private movimentacaoAtivoService: MovimentacaoAtivoService,
    private formBuilder: FormBuilder,
    private router: Router
  ){
    this.movimentacaoAtivoForm = formBuilder.group({
      ticker: new FormControl('', [Validators.required]),
      valor: new FormControl(0, [Validators.required, Validators.min(0)]),
      qtd: new FormControl(0, [Validators.required, Validators.min(0)]),
      dataMovimentacao: new FormControl(null, [this.dataMaiorAtual])
    })
  }

  dataMaiorAtual(control: AbstractControl): ValidationErrors | null {
    if(control.value){
      return (Date.parse(control.value) > Date.now())? {dataMaiorAtual: true} : null;
    }
    return null;
  }

  ngOnInit(): void {
    this.ativosMovimentados$ = this.movimentacaoAtivoService.obterMovimentacoesDeAtivos().pipe(tap(value => console.log(value)));  
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
      .pipe(take(1), tap(x => console.log(x)))
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
}
