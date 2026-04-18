export default function ProdutosEstoque() {
  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{fontWeight: 300, color: '#337ab7'}}>ESTOQUE</h2>
      </div>
      
      <div style={{padding: '20px'}}>
        
        {/* Barra de Filtros */}
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
          
          <select className="form-control" style={{width: '150px'}}>
             <option>Grupo...</option>
          </select>
          <select className="form-control" style={{width: '150px'}}>
             <option>Todos</option>
          </select>
          <select className="form-control" style={{width: '150px'}}>
             <option>Marca...</option>
          </select>

          <div className="input-group" style={{width: '150px'}}>
             <input type="text" className="form-control" placeholder="Unid. Medida" />
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0', background: '#eee'}}>Q</button>
          </div>

          <div className="input-group" style={{flex: 1, minWidth: '200px'}}>
             <input type="text" className="form-control" placeholder="Produto" />
             <button className="btn btn-default" style={{borderRadius: '0 3px 3px 0', background: '#eee', fontWeight: 'bold'}}>Q PESQUISAR</button>
          </div>
        </div>

        {/* Blocos de Totais Grandes Azuis */}
        <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
           <div style={{flex: 1, background: '#3498db', color: 'white', padding: '20px', textAlign: 'right', borderRadius: '3px', position: 'relative', overflow: 'hidden'}}>
              <div style={{fontSize: '120px', position: 'absolute', left: '-10px', top: '-30px', opacity: 0.1}}>$</div>
              <div style={{fontSize: '16px', fontWeight: 'bold', marginTop: '30px'}}>Total do Estoque</div>
           </div>

           <div style={{flex: 1, background: '#3498db', color: 'white', padding: '20px', textAlign: 'right', borderRadius: '3px', position: 'relative', overflow: 'hidden'}}>
              <div style={{fontSize: '120px', position: 'absolute', left: '-10px', top: '-30px', opacity: 0.1}}>$</div>
              <div style={{fontSize: '32px', fontWeight: '300'}}>R$ 0,00</div>
              <div style={{fontSize: '14px'}}>Total Preço de Custo</div>
           </div>

           <div style={{flex: 1, background: '#3498db', color: 'white', padding: '20px', textAlign: 'right', borderRadius: '3px', position: 'relative', overflow: 'hidden'}}>
              <div style={{fontSize: '120px', position: 'absolute', left: '-10px', top: '-30px', opacity: 0.1}}>$</div>
              <div style={{fontSize: '32px', fontWeight: '300'}}>R$ 0,00</div>
              <div style={{fontSize: '14px'}}>Total Preço de Venda</div>
           </div>
        </div>

        <table className="sa-table" style={{border: '1px solid #eee'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #ddd'}}>
              <th style={{color: '#555', background: 'white'}}>NOME PRODUTO</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>U.M.</th>
              <th style={{color: '#555', background: 'white'}}>GRUPO</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>QTD. MÍNIMA</th>
              <th style={{color: '#555', background: 'white', textAlign: 'center'}}>ESTOQUE ATUAL</th>
              <th style={{color: '#555', background: 'white', textAlign: 'right'}}>SUBTOTAL CUSTO</th>
              <th style={{color: '#555', background: 'white', textAlign: 'right'}}>SUBTOTAL VENDA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                Não há estoque para o filtro atual.
              </td>
            </tr>
          </tbody>
        </table>
        
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
    </div>
  );
}
