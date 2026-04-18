export default function AnaliseFluxoMensal() {
  const dias = Array.from({length: 8}, (_, i) => i + 1);
  
  return (
    <div style={{padding: '15px'}}>
      
      {/* Filtros da Análise */}
      <div className="card" style={{border: '1px solid #4a68af', marginBottom: '20px', overflow: 'hidden'}}>
        <div style={{background: '#4a68af', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
          Filtros
        </div>
        <div style={{padding: '15px', display: 'flex', gap: '15px', background: 'white'}}>
          <button className="btn btn-default" style={{flex: 1, color: '#337ab7', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
            TODAS AS CONTAS <span>▼</span>
          </button>
          <button className="btn btn-default" style={{flex: 1, color: '#337ab7', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
            MAIS FILTROS <span>▼</span>
          </button>
          <select className="form-control" style={{flex: 1, color: '#337ab7', fontWeight: 'bold'}}>
            <option>CATEGORIAS..</option>
          </select>
          <div style={{display: 'flex', flex: 1}}>
             <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px'}}>«</button>
             <button className="btn btn-default" style={{borderRadius: '0', flex: 1, color: '#337ab7', fontWeight: 'bold'}}>ABRIL 2026</button>
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0'}}>»</button>
          </div>
        </div>
      </div>

      {/* Tabela de Fluxo Diário */}
      <div style={{background: 'white', border: '1px solid #ddd'}}>
        <table className="sa-table" style={{borderCollapse: 'collapse', width: '100%'}}>
          <thead>
            <tr>
              <th style={{background: 'white'}}></th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Saldo<br/>Inicial</th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Receita</th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Despesa</th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Lucro ou<br/>Prejuízo</th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Acumulado</th>
              <th style={{background: '#2ecc71', color: 'white', textAlign: 'center'}}>Contas a<br/>Receber</th>
              <th style={{background: '#e74c3c', color: 'white', textAlign: 'center'}}>Contas a<br/>Pagar</th>
              <th style={{background: '#3498db', color: 'white', textAlign: 'center'}}>Necessidade de<br/>Caixa</th>
            </tr>
          </thead>
          <tbody>
            {dias.map((d, i) => (
              <tr key={i}>
                <td style={{background: '#3498db', color: 'white', fontWeight: 'bold', textAlign: 'center'}}>{d}</td>
                <td style={{textAlign: 'center', color: '#555'}}>2.137,76</td>
                <td style={{textAlign: 'center', color: '#555'}}>0,00</td>
                <td style={{textAlign: 'center', color: '#555'}}>0,00</td>
                <td style={{textAlign: 'center', color: '#3498db', background: '#e8f8f5'}}>0,00</td>
                <td style={{textAlign: 'center', color: '#2ecc71', background: '#e8f8f5', fontWeight: 'bold'}}>2.137,76</td>
                <td style={{textAlign: 'center', color: '#555'}}>0,00</td>
                <td style={{textAlign: 'center', color: '#555'}}>0,00</td>
                <td style={{textAlign: 'center', color: '#555'}}>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
