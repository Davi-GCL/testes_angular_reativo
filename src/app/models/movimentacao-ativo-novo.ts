import { MovimentacaoAtivo } from "./movimentacao-ativo";

export type MovimentacaoAtivoNovo = Omit<MovimentacaoAtivo, 'id'>;