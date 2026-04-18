export default function Profissional() {
  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{color: '#337ab7', fontWeight: 600}}>PROFISSIONAL</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center'}}>
          <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5'}}>+ NOVO PROFISSIONAL</button>
          
          <div className="input-group" style={{flex: 1}}>
            <input type="text" className="form-control" placeholder="Pesquisar por..." />
            <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0'}}>Q PESQUISAR</button>
          </div>
          
          <select className="form-control" style={{width: '120px'}}><option>Ativo</option></select>
          
          <div style={{display: 'flex'}}>
             <div style={{background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px'}}>TOTAL</div>
             <div style={{background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0'}}>1 profissional(is)</div>
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th>NOME</th>
              <th>E-MAIL</th>
              <th>GRUPO DE ACESSO</th>
              <th>ÚLTIMO ACESSO</th>
              <th>COR</th>
              <th>ORDEM</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{color: '#337ab7'}}>Fabricia Rodrigues Pereira</td>
              <td style={{color: '#337ab7'}}>fabriciapodologa@gmail.com</td>
              <td style={{color: '#337ab7'}}>Administrador</td>
              <td style={{color: '#337ab7'}}>16/04/2026 17:23:00</td>
              <td><div style={{width:'20px', height:'20px', backgroundColor: '#0044cc'}}></div></td>
              <td style={{color: '#337ab7'}}>0</td>
              <td><span style={{background: '#26b99a', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize:'10px'}}>ATIVO</span></td>
              <td>
                <div style={{display: 'flex', gap: '5px'}}>
                  <button className="btn btn-default" style={{padding: '2px 8px', color: '#337ab7'}}>✎</button>
                  <button className="btn btn-default" style={{padding: '2px 8px', color: '#d9534f'}}>🗑</button>
                </div>
              </td>
            </tr>
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

        <div style={{marginTop: '30px', fontSize: '11px', color: '#777', textAlign: 'center'}}>
           2016-2026 © Simples Agenda - Copyright® - Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
