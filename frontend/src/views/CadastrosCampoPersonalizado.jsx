export default function CadastrosCampoPersonalizado() {
  const campos = [
    { nome: 'PODOPROFILAXIA- ?corte correto?limpeza das cutículas?higienização?calosidades?fissura?exfoliação?lix', obrigatorio: 'SIM', status: 'ATIVO' },
    { nome: 'PODOPROFILAXIA- ?corte correto?limpeza das cutículas?higienização?calosidades?fissura?exfoliação?lix', obrigatorio: 'NÃO', status: 'INATIVO' },
  ];

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 'bold', color: '#337ab7'}}>CAMPO PERSONALIZADO</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVO CAMPO</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q PESQUISAR</button>
          </div>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>2 campo(s)</div>
          </div>
        </div>

        <table className="sa-table" style={{border: '1px solid #eee', background: 'white'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #ddd'}}>
              <th style={{color: '#555', width: '60%'}}>NOME DO CAMPO</th>
              <th style={{color: '#555'}}>TIPO</th>
              <th style={{color: '#555'}}>OBRIGATÓRIO</th>
              <th style={{color: '#555'}}>STATUS</th>
              <th style={{color: '#555', textAlign: 'center'}}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {campos.map((c, i) => (
              <tr key={i}>
                <td style={{color: '#337ab7'}}>{c.nome}</td>
                <td style={{color: '#555'}}>Texto</td>
                <td>
                  <span style={{background: c.obrigatorio === 'SIM' ? '#26b99a' : '#e74ca3', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>
                    {c.obrigatorio}
                  </span>
                </td>
                <td>
                  <span style={{background: c.status === 'ATIVO' ? '#26b99a' : '#d9534f', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>
                    {c.status}
                  </span>
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
