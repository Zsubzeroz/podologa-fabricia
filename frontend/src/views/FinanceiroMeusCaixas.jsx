export default function FinanceiroMeusCaixas() {
  return (
    <div style={{padding: '15px'}}>
      <div style={{display: 'flex', gap: '20px'}}>
        
        {/* Esquerda - Filtros e Tabela */}
        <div style={{flex: 2}}>
          <div className="card" style={{border: '1px solid #428bca', marginBottom: '20px'}}>
            <div style={{background: '#428bca', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
              Filtros
            </div>
            <div style={{padding: '15px', display: 'flex', gap: '10px', alignItems: 'center'}}>
              <select className="form-control" style={{flex: 1}}><option>FABRICIA RODRIGUES PEF</option></select>
              <select className="form-control" style={{flex: 1}}><option>STATUS..</option></select>
              <div className="input-group" style={{flex: 1}}>
                <input type="text" className="form-control" placeholder="Caixa..." />
                <button className="btn btn-warning" style={{borderRadius: '0 3px 3px 0', background: '#d5b348', borderColor: '#c4a237', color: 'white'}}>✖</button>
              </div>
              <div style={{display: 'flex', flex: 1}}>
                 <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px'}}>«</button>
                 <button className="btn btn-default" style={{borderRadius: '0', flex: 1, color: '#337ab7', fontWeight: 'bold'}}>ABRIL 2026</button>
                 <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0'}}>»</button>
              </div>
            </div>
          </div>

          <table className="sa-table" style={{border: '1px solid #eee', background: 'white'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #ddd'}}>
                <th style={{color: '#666', fontSize: '13px'}}>Caixa</th>
                <th style={{color: '#666', fontSize: '13px'}}>Abertura</th>
                <th style={{color: '#666', fontSize: '13px'}}>Fechamento</th>
                <th style={{color: '#666', fontSize: '13px'}}>Profissional</th>
                <th style={{color: '#666', fontSize: '13px', textAlign: 'right'}}>Valor<br/>Fechamento</th>
                <th style={{color: '#666', fontSize: '13px'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                  Nenhum resultado foi encontrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Direita - Ações Rápidas */}
        <div style={{flex: 1}}>
          <div className="card" style={{border: '1px solid #4a68af', overflow: 'hidden'}}>
            <div style={{background: '#4a68af', color: 'white', padding: '10px 15px', fontWeight: 'bold'}}>
              Caixa - Nenhum caixa aberto.
            </div>
            <div style={{padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'white'}}>
               
               <div style={{background: '#9b59b6', color: 'white', padding: '30px 15px', textAlign: 'center', borderRadius: '3px'}}>
                  <div style={{fontSize: '22px', fontWeight: '300'}}>Caixa</div>
                  <div style={{fontSize: '13px'}}>Nenhum caixa aberto.</div>
               </div>

               <button className="btn btn-success" style={{width: '100%', padding: '10px', fontWeight: 'bold', background: '#26b99a', border: 'none', fontSize: '13px'}}>
                 + ABRIR NOVO CAIXA
               </button>
               
               <button className="btn btn-warning" style={{width: '100%', padding: '10px', fontWeight: 'bold', background: '#e67e22', border: 'none', color: 'white', fontSize: '13px'}}>
                 🛎 REABRIR CAIXA
               </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
