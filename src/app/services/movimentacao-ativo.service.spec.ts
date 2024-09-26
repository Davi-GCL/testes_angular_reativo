import { TestBed } from '@angular/core/testing';

import { MovimentacaoAtivoService } from './movimentacao-ativo.service';

describe('MovimentacaoAtivoService', () => {
  let service: MovimentacaoAtivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimentacaoAtivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
