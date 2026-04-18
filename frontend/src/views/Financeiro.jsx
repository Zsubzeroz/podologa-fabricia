export default function Financeiro() {
  return (
    <div style={{padding: '15px'}}>
      
      {/* Barra de Filtros Superior */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center'}}>
         <button className="btn btn-default" style={{flex: 1, padding: '8px', color: '#555', display: 'flex', justifyContent: 'space-between'}}>
           TODAS AS CONTAS <span>▼</span>
         </button>
         <button className="btn btn-default" style={{flex: 1, padding: '8px', color: '#555', display: 'flex', justifyContent: 'space-between'}}>
           MAIS FILTROS <span>▼</span>
         </button>
         <select className="form-control" style={{flex: 1}}><option>Categorias..</option></select>
         
         <div style={{display: 'flex', flex: 1}}>
           <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px', padding: '8px 12px'}}>«</button>
           <button className="btn btn-default" style={{borderRadius: '0', padding: '8px 12px', flex: 1, color: '#337ab7', fontWeight: 'bold'}}>ABRIL 2026</button>
           <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0', padding: '8px 12px'}}>»</button>
         </div>

         <button className="btn btn-default" style={{flex: 1, padding: '8px', color: '#337ab7', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
           EXIBIR TODAS <span>▼</span>
         </button>
      </div>

      <div style={{display: 'flex', gap: '15px'}}>
        
        {/* Lado Esquerdo - Contas a Receber */}
        <div style={{flex: 3}}>
           <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
              <button className="btn btn-success" style={{flex: 1, padding: '10px', fontSize: '13px', fontWeight: 'bold', background: '#26b99a', border: 'none'}}>
                + CONTAS A RECEBER
              </button>
              <button className="btn btn-default" style={{flex: 1, padding: '10px', fontSize: '13px', fontWeight: 'bold', background: '#eee', color: '#555'}}>
                - CONTAS A PAGAR
              </button>
              <button className="btn btn-default" style={{flex: 1, padding: '10px', fontSize: '13px', fontWeight: 'bold', background: '#eee', color: '#555'}}>
                $ EXTRATO
              </button>
           </div>

           <div className="card" style={{border: '1px solid #ddd'}}>
              <div style={{background: '#26b99a', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px'}}>
                 Contas a Receber ❓
              </div>
              <div style={{padding: '15px', background: 'white'}}>
                 
                 <div style={{display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '15px'}}>
                    <button className="btn btn-success" style={{background: '#26b99a', border: 'none', padding: '5px 10px', fontSize: '11px'}}>+ NOVA VENDA</button>
                    <button className="btn btn-success" style={{background: '#26b99a', border: 'none', padding: '5px 10px', fontSize: '11px'}}>+ NOVO RECEBIMENTO</button>
                    <button className="btn btn-default" style={{padding: '5px 10px'}}>📊</button>
                    <button className="btn btn-default" style={{padding: '5px 10px'}}>🖨️</button>
                 </div>

                 <table className="sa-table" style={{border: '1px solid #eee'}}>
                    <thead>
                       <tr style={{borderBottom: '2px solid #ddd'}}>
                          <th style={{color: '#666'}}>Data</th>
                          <th style={{color: '#666'}}>Descrição</th>
                          <th style={{color: '#666', textAlign: 'center'}}>Forma</th>
                          <th style={{color: '#666', textAlign: 'center'}}>Parcela</th>
                          <th style={{color: '#666', textAlign: 'right'}}>Valor</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                            Nenhum resultado foi encontrado.
                          </td>
                       </tr>
                    </tbody>
                 </table>
                 
                 <div style={{display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{display: 'flex', border: '1px solid #ccc', borderRadius: '3px'}}>
                       <button style={{padding: '4px 10px', background: '#eee', border: 'none', borderRight: '1px solid #ccc'}}>«</button>
                       <button style={{padding: '4px 10px', background: '#eee', border: 'none', borderRight: '1px solid #ccc'}}>«</button>
                       <button style={{padding: '4px 10px', background: 'white', border: 'none', borderRight: '1px solid #ccc'}}>1</button>
                       <button style={{padding: '4px 10px', background: '#eee', border: 'none', borderRight: '1px solid #ccc'}}>»</button>
                       <button style={{padding: '4px 10px', background: '#eee', border: 'none'}}>»</button>
                    </div>
                    <select className="form-control" style={{width: 'auto', padding: '4px'}}><option>10</option></select>
                    <span style={{fontSize: '12px', color: '#666'}}>por página</span>
                 </div>

              </div>
           </div>
           
           <div style={{marginTop: '10px', fontSize: '12px', color: '#555', display: 'flex', gap: '10px', alignItems: 'center'}}>
              Legendas: 
              <span style={{color: '#26b99a', fontWeight: 'bold'}}>✔</span>
              <span style={{color: '#26b99a'}}>✔</span>
              <span style={{color: '#d9534f'}}>⛔</span>
              <span>🕒</span>
              <span>⇆</span>
              <span>🧾</span>
              <span>❗️</span>
              <span style={{color: '#26b99a'}}>✔️</span>
              <span style={{color: '#d9534f'}}>❌</span>
              <span style={{fontWeight: 'bold'}}>NF</span>
              <span>NF✔</span>
              <span style={{color: '#d9534f'}}>NFx</span>
           </div>

        </div>

        {/* Lado Direito - Totais */}
        <div style={{flex: 1}}>
           <div className="card" style={{border: '1px solid #ddd', overflow: 'hidden'}}>
              <div style={{background: '#2ab27b', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between'}}>
                 <span>Totais a Receber</span>
                 <span>👁️</span>
              </div>
              <div style={{padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                 
                 <div style={{background: '#2ab27b', color: 'white', padding: '20px 15px', borderRadius: '3px', textAlign: 'right', position: 'relative', overflow: 'hidden'}}>
                    <div style={{fontSize: '80px', position: 'absolute', left: '-10px', top: '-10px', opacity: 0.2}}>$</div>
                    <div style={{fontSize: '28px', fontWeight: '300'}}>R$ 0,00</div>
                    <div style={{fontSize: '13px'}}>Recebidas</div>
                 </div>

                 <div style={{background: '#7f8c8d', color: 'white', padding: '20px 15px', borderRadius: '3px', textAlign: 'right', position: 'relative', overflow: 'hidden'}}>
                    <div style={{fontSize: '80px', position: 'absolute', left: '-10px', top: '-10px', opacity: 0.2}}>$</div>
                    <div style={{fontSize: '28px', fontWeight: '300'}}>R$ 0,00</div>
                    <div style={{fontSize: '13px'}}>A Receber</div>
                 </div>

                 <div style={{background: '#e74c3c', color: 'white', padding: '20px 15px', borderRadius: '3px', textAlign: 'right', position: 'relative', overflow: 'hidden'}}>
                    <div style={{fontSize: '80px', position: 'absolute', left: '-10px', top: '-10px', opacity: 0.2}}>$</div>
                    <div style={{fontSize: '28px', fontWeight: '300'}}>R$ 0,00</div>
                    <div style={{fontSize: '13px'}}>Vencidas</div>
                 </div>

                 <div style={{background: '#bdc3c7', color: 'white', padding: '20px 15px', borderRadius: '3px', textAlign: 'right', position: 'relative', overflow: 'hidden'}}>
                    <div style={{fontSize: '80px', position: 'absolute', left: '-10px', top: '-10px', opacity: 0.2}}>$</div>
                    <div style={{fontSize: '28px', fontWeight: '300'}}>R$ 0,00</div>
                    <div style={{fontSize: '13px'}}>Total Geral</div>
                 </div>

              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
