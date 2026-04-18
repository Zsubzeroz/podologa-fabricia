export default function FinanceiroCategoria() {
  const categorias = [
    { nome: 'Despesa', status: 'ATIVO', tipo: 'header' },
    { nome: 'Despesas Financeiras', status: 'ATIVO', indent: 1 },
    { nome: 'Juros sobre empréstimos', status: 'ATIVO', indent: 2 },
    { nome: 'Taxas bancárias', status: 'ATIVO', indent: 2 },
    { nome: 'Despesas Fixas', status: 'ATIVO', indent: 1 },
    { nome: 'Água', status: 'ATIVO', indent: 2 },
    { nome: 'Alarme', status: 'ATIVO', indent: 2 },
    { nome: 'Aluguel', status: 'ATIVO', indent: 2 },
    { nome: 'Celular', status: 'ATIVO', indent: 2 },
  ];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 300}}>PESQUISA</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVA CATEGORIA</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q PESQUISAR</button>
          </div>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>48 categoria(s)</div>
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th style={{width: '60%'}}>NOME DA CATEGORIA</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c, i) => (
              <tr key={i}>
                <td style={{
                  paddingLeft: c.indent ? `${c.indent * 30}px` : '15px',
                  color: c.tipo === 'header' ? '#337ab7' : '#337ab7',
                  fontSize: c.tipo === 'header' ? '18px' : (c.indent === 1 ? '16px' : '14px')
                }}>
                  {c.nome}
                </td>
                <td><span style={{background: '#26b99a', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>ATIVO</span></td>
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
