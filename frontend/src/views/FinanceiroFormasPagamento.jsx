export default function FinanceiroFormasPagamento() {
  const pagamentos = [
    { nome: 'Cartão de Crédito', tipo: 'Cartão de Crédito', aplicacao: 'Vendas', conta: 'Faculdade' },
    { nome: 'Cartão de Débito', tipo: 'Cartão de Débito', aplicacao: 'Vendas', conta: 'Faculdade' },
    { nome: 'Dinheiro', tipo: 'Espécie', aplicacao: 'Vendas', conta: '' },
    { nome: 'Pix', tipo: 'Outros', aplicacao: 'Vendas', conta: 'Faculdade' },
  ];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 300}}>PESQUISA</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVA FORMA DE PAGAMENTO</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q PESQUISAR</button>
          </div>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>5 registro(s)</div>
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th style={{width: '25%'}}>NOME DO PAGAMENTO</th>
              <th style={{width: '20%'}}>TIPO</th>
              <th style={{width: '15%'}}>APLICAÇÃO</th>
              <th style={{width: '20%'}}>CONTA DESTINO</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((p, i) => (
              <tr key={i}>
                <td style={{color: '#337ab7'}}>{p.nome}</td>
                <td style={{color: '#337ab7'}}>{p.tipo}</td>
                <td style={{color: '#337ab7'}}>{p.aplicacao}</td>
                <td style={{color: '#337ab7'}}>{p.conta}</td>
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
        
        <div style={{display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center'}}>
           <select className="form-control" style={{width: 'auto'}}><option>10 por página</option></select>
           <div style={{display: 'flex', border: '1px solid #ccc', borderRadius: '3px', background: 'white'}}>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>«</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>«</button>
              <button style={{padding: '5px 10px', border: 'none', background: '#e6e6e6', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#333'}}>1</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>»</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#999'}}>»</button>
           </div>
        </div>

      </div>
    </div>
  );
}
