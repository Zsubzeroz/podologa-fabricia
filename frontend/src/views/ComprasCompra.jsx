export default function ComprasCompra() {
  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>COMPRA ❓</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        
        {/* Barra de Ações Superior */}
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
          
          <select className="form-control" style={{width: '200px'}}>
             <option>Todos Fornecedores</option>
          </select>

          <div style={{display: 'flex', width: '150px'}}>
             <button className="btn btn-default" style={{borderRadius: '3px 0 0 3px'}}>«</button>
             <button className="btn btn-default" style={{borderRadius: '0', flex: 1, fontWeight: 'bold', fontSize: '11px'}}>ABRIL 2026</button>
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0'}}>»</button>
          </div>

          <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
             <input type="text" className="form-control" placeholder="Período" style={{width: '100px'}} />
             <span style={{color: '#777'}}>até</span>
             <input type="text" className="form-control" placeholder="Período" style={{width: '100px'}} />
          </div>

          <div className="input-group" style={{flex: 1, minWidth: '200px'}}>
             <input type="text" className="form-control" placeholder="Produto" />
             <button className="btn btn-success" style={{borderRadius: '0 3px 3px 0', background: '#26b99a'}}>Q</button>
          </div>
          
          <button className="btn btn-default">🔄</button>
        </div>

        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
           <button className="btn btn-primary" style={{backgroundColor: '#3fa9f5', fontWeight: 'bold'}}>+ NOVA COMPRA</button>
           <button className="btn btn-success" style={{backgroundColor: '#2ecc71', fontWeight: 'bold', border: 'none'}}>IMPORTAR XML</button>
        </div>

        {/* Blocos de Totais Grandes Azuis */}
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
           <div style={{flex: 1, background: '#3498db', color: 'white', padding: '20px', textAlign: 'right', borderRadius: '3px', position: 'relative', overflow: 'hidden'}}>
              <div style={{fontSize: '120px', position: 'absolute', left: '-10px', top: '-30px', opacity: 0.1}}>$</div>
              <div style={{fontSize: '32px', fontWeight: '300'}}>R$ 0,00</div>
              <div style={{fontSize: '14px'}}>Total no Ano</div>
           </div>

           <div style={{flex: 1, background: '#3498db', color: 'white', padding: '20px', textAlign: 'right', borderRadius: '3px', position: 'relative', overflow: 'hidden'}}>
              <div style={{fontSize: '120px', position: 'absolute', left: '-10px', top: '-30px', opacity: 0.1}}>$</div>
              <div style={{fontSize: '32px', fontWeight: '300'}}>R$ 0,00</div>
              <div style={{fontSize: '14px'}}>Total de Compras</div>
           </div>
        </div>

        <table className="sa-table" style={{border: '1px solid #eee'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #ddd'}}>
              <th style={{color: '#555', background: 'white'}}>CÓDIGO</th>
              <th style={{color: '#555', background: 'white'}}>ENTRADA</th>
              <th style={{color: '#555', background: 'white'}}>FORNECEDOR</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>NF</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>EMISSÃO NF</th>
              <th style={{color: '#555', background: 'white', textAlign: 'right'}}>TOTAL LÍQUIDO</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                Não há compras para o filtro atual.
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}
