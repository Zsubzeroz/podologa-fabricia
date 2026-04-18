export default function ConsultaPrevisaoRetorno() {
  return (
    <div style={{padding: '15px'}}>
      
      {/* Filtros da Previsão */}
      <div className="card" style={{border: '1px solid #4a68af', marginBottom: '20px', overflow: 'hidden'}}>
        <div style={{background: '#4a68af', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
          Filtros para Previsão de Retorno
        </div>
        <div style={{padding: '15px', display: 'flex', gap: '15px', background: 'white'}}>
          
          <div className="input-group" style={{flex: 1}}>
             <input type="text" className="form-control" placeholder="Serviço ou Produto..." />
             <button className="btn btn-warning" style={{background: '#d9a138', border: 'none', borderRadius: '0 3px 3px 0', color: 'white'}}>✖</button>
          </div>

          <div className="input-group" style={{flex: 1}}>
             <input type="text" className="form-control" placeholder="Cliente..." />
             <button className="btn btn-warning" style={{background: '#d9a138', border: 'none', borderRadius: '0 3px 3px 0', color: 'white'}}>✖</button>
          </div>

          <button className="btn btn-default" style={{flex: 1, color: '#337ab7', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>
            FILTRAR POR DATA AGENDA <span>▼</span>
          </button>
          
          <div style={{display: 'flex', width: '200px'}}>
             <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px'}}>«</button>
             <button className="btn btn-default" style={{borderRadius: '0', flex: 1, color: '#337ab7', fontWeight: 'bold'}}>ABRIL 2026</button>
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0'}}>»</button>
          </div>
        </div>
      </div>

      {/* Tabela de Controle */}
      <div style={{background: 'white', border: '1px solid #ddd'}}>
        <div style={{background: '#e74c3c', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
          Controle das Previsões de Retorno
        </div>
        <table className="sa-table" style={{borderCollapse: 'collapse', width: '100%'}}>
          <thead>
            <tr>
              <th style={{background: 'white', color: '#555', padding: '15px'}}>Cliente</th>
              <th style={{background: 'white', color: '#555', padding: '15px'}}>Serviço / Produto</th>
              <th style={{background: 'white', color: '#555', padding: '15px', textAlign: 'center'}}>Data Agenda</th>
              <th style={{background: 'white', color: '#555', padding: '15px', textAlign: 'center'}}>Previsão Retorno</th>
              <th style={{background: 'white', color: '#555', padding: '15px', textAlign: 'center'}}>SMS Programado</th>
              <th style={{background: 'white', color: '#555', padding: '15px', textAlign: 'center'}}>Status SMS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#555'}}>
                Não há nenhuma previsão para este período.
              </td>
            </tr>
          </tbody>
        </table>
        
        <div style={{display: 'flex', gap: '10px', padding: '20px', alignItems: 'center', justifyContent: 'center'}}>
           <div style={{display: 'flex', border: '1px solid #ccc', borderRadius: '3px', background: 'white'}}>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>«</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>«</button>
              <button style={{padding: '5px 10px', border: 'none', background: '#e6e6e6', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#333'}}>1</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRight: '1px solid #ccc', color: '#999'}}>»</button>
              <button style={{padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#999'}}>»</button>
           </div>
           <select className="form-control" style={{width: 'auto', marginLeft: '10px'}}><option>10</option></select>
           <span style={{color: '#555'}}>por página</span>
        </div>
      </div>

    </div>
  );
}
