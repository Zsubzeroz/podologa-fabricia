export default function CadastrosOperadoras() {
  const operadoras = ['Claro', 'Oi', 'Outro', 'TIM', 'Vivo'];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 'bold', color: '#337ab7'}}>OPERADORAS DE CELULAR</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVA OPERADORA</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q PESQUISAR</button>
          </div>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>5 operadora(s)</div>
          </div>
        </div>

        <table className="sa-table" style={{border: '1px solid #eee', background: 'white'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #ddd'}}>
              <th style={{color: '#555', width: '70%'}}>NOME DA OPERADORA</th>
              <th style={{color: '#555'}}>STATUS</th>
              <th style={{color: '#555', textAlign: 'center'}}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {operadoras.map((o, i) => (
              <tr key={i}>
                <td style={{color: '#337ab7'}}>{o}</td>
                <td>
                  <span style={{background: '#26b99a', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>ATIVO</span>
                </td>
                <td style={{textAlign: 'center'}}>
                  <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
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
