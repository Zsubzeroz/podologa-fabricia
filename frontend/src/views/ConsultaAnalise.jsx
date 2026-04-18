export default function ConsultaAnalise() {
  return (
    <div style={{padding: '15px'}}>
      
      <div style={{marginBottom: '20px', color: '#337ab7', fontSize: '20px', fontWeight: '300'}}>
        ANÁLISE
      </div>

      {/* Filtros da Análise */}
      <div className="card" style={{border: '1px solid #4a68af', marginBottom: '20px', overflow: 'hidden'}}>
        <div style={{background: '#4a68af', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
          Filtros
        </div>
        <div style={{padding: '15px', display: 'flex', gap: '15px', background: 'white'}}>
          <button className="btn btn-default" style={{flex: 1, color: '#337ab7', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
            TIPO DO FILTRO <span>▼</span>
          </button>
          <button className="btn btn-default" style={{flex: 1, color: '#337ab7', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
            MAIS FILTROS <span>▼</span>
          </button>
          <div style={{display: 'flex', width: '200px'}}>
             <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px'}}>«</button>
             <button className="btn btn-default" style={{borderRadius: '0', flex: 1, color: '#337ab7', fontWeight: 'bold'}}>ABRIL 2026</button>
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0'}}>»</button>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div style={{background: 'white', border: '1px solid #ddd'}}>
        <table className="sa-table" style={{borderCollapse: 'collapse', width: '100%'}}>
          <thead>
            <tr>
              <th style={{background: 'white', color: '#555', padding: '15px'}}>COMO CONHECEU A EMPRESA</th>
              <th style={{background: 'white', color: '#555', padding: '15px', textAlign: 'center'}}>TOTAL DE CADASTROS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" style={{textAlign: 'center', padding: '40px 20px', color: '#555'}}>
                Não há registro para ser listado.<br/>
                Verifique os <b>Filtro</b> da pesquisa.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center', justifyContent: 'center'}}>
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
  );
}
