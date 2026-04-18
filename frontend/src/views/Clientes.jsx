import { useState } from 'react';

export default function Clientes() {
  const clientes = [
    { nome: 'Adriano Rangel', data: '23/10/2025', contato: '(19) 99381-8556 Outro' },
    { nome: 'Alessandra Rodrigues dos Santos', status: 'CADASTRO INCOMPLETO', data: '16/03/2026', contato: '(19) 99574-5363 Outro' },
    { nome: 'Amanda', status: 'CADASTRO INCOMPLETO', data: '11/12/2025', contato: '(19) 99246-0623 Outro' },
    { nome: 'Ana Delgado', status: 'CADASTRO INCOMPLETO', data: '15/12/2025', contato: '(19) 97145 4758 Outro' },
    { nome: 'Anderson', status: 'CADASTRO-AGENDA-ONLINE', data: '02/01/2026', contato: '(19) 98298-1492 Outro' },
    { nome: 'Andréa', data: '22/10/2025', contato: '(19) 99798-9924 Outro' },
  ];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title">Clientes</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVO CLIENTE</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0'}}>Q PESQUISAR</button>
          </div>
          
          <select className="form-control" style={{width: '120px'}}><option>Ativo</option></select>
          <button className="btn" style={{backgroundColor: '#555', color: 'white'}}>EXPORTAR P/ EXCEL</button>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>115 cliente(s)</div>
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th>NOME DO CLIENTE</th>
              <th>CADASTRO</th>
              <th>DATA NASCIMENTO</th>
              <th>BAIRRO</th>
              <th>CIDADE</th>
              <th>CONTATO</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <tr key={i}>
                <td>
                  <span style={{color: '#337ab7'}}>{c.nome}</span>
                  {c.status && <div style={{fontSize: '10px', color: 'white', background: '#34495e', padding: '2px 6px', display: 'inline-block', borderRadius: '2px', marginTop: '3px'}}>{c.status}</div>}
                </td>
                <td style={{color: '#337ab7'}}>{c.data}</td>
                <td style={{color: '#337ab7'}}>🎂</td>
                <td style={{color: '#337ab7'}}>/</td>
                <td style={{color: '#337ab7'}}>/</td>
                <td style={{color: '#337ab7'}}>
                   {c.contato}<br/>
                   <span style={{fontSize: '11px', color: '#999'}}>dm1556114@gmail.com</span>
                </td>
                <td><span style={{background: '#26b99a', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>ATIVO</span></td>
                <td>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <button className="btn btn-default" style={{padding: '2px 8px', color: '#337ab7'}}>👤</button>
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
