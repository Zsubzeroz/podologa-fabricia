export default function CadastrosMarcas() {
  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 'bold', color: '#337ab7'}}>MARCAS</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVA MARCA</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q PESQUISAR</button>
          </div>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>0 marca(s)</div>
          </div>
        </div>

        <table className="sa-table" style={{border: '1px solid #eee', background: 'white'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #ddd'}}>
              <th style={{color: '#555', width: '80%'}}>NOME DA MARCA</th>
              <th style={{color: '#555', textAlign: 'center'}}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" style={{padding: '15px', color: '#337ab7'}}>
                Registro não encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
