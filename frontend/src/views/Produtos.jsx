import { useState } from 'react';

export default function Produtos() {
  const produtos = [
    { nome: 'APLICAÇÃO DE ACIDO', grupo: 'podólogia | Terapia', preco: '50,00' },
    { nome: 'AVALIAÇÃO', grupo: 'podólogia | Terapia', preco: '50,00' },
    { nome: 'BANDAGEM TERAPÊUTICA', grupo: 'podólogia | Terapia', preco: '60,00' },
    { nome: 'BANDAGEM TERAPÊUTICA', sub: 'Quantidade do Pacote: 10', grupo: 'podólogia | Terapia', preco: '45,00' },
    { nome: 'CALOS E CALOSIDADE', grupo: 'podólogia | Terapia', preco: '50,00' },
    { nome: 'Corte', grupo: 'Podólogia | Clinico', preco: '30,00' },
    { nome: 'Fissuras (rachaduras e hidratação)', grupo: 'Podólogia | Clinico', preco: '70,00' },
    { nome: 'LASERTERAPIA PACOTE', sub: 'Quantidade do Pacote: 10', grupo: 'podólogia | Terapia', preco: '70,00' },
  ];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title">Produtos e Serviços</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVO PRODUTO OU SERVIÇO</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0'}}>Q PESQUISAR</button>
          </div>
          
          <button className="btn btn-default" style={{background: '#e0e0e0'}}>LIMPAR</button>
          <button className="btn" style={{backgroundColor: '#9575cd', color: 'white'}}>▼ FILTRO AVANÇADO</button>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>18 registros</div>
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th style={{width: '50px'}}></th>
              <th>PRODUTO / SERVIÇO</th>
              <th>GRUPO | SUBGRUPO</th>
              <th>ESTOQUE</th>
              <th>PREÇO VENDA</th>
              <th>COMISSÃO (%)</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p, i) => (
              <tr key={i}>
                <td><div className="circle-avatar">A</div></td>
                <td>
                  <span style={{color: '#337ab7'}}>{p.nome}</span>
                  {p.sub && <div style={{fontSize: '11px', color: '#999', marginTop: '3px'}}>{p.sub}</div>}
                </td>
                <td style={{color: '#337ab7'}}>{p.grupo}</td>
                <td style={{color: '#337ab7'}}>-</td>
                <td style={{color: '#337ab7'}}>{p.preco}</td>
                <td style={{color: '#337ab7'}}>0,00</td>
                <td>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <button className="btn btn-default" style={{padding: '2px 8px', color: '#337ab7'}}>✎</button>
                    <button className="btn btn-default" style={{padding: '2px 8px', color: '#d9534f'}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
