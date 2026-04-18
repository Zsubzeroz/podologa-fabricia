export default function ConsultaPacotes() {
  return (
    <div style={{padding: '20px', background: '#f9fafc', minHeight: '100vh'}}>
      <div className="card" style={{border: '1px solid #e0e6ed', borderRadius: '3px', background: 'white', overflow: 'hidden'}}>
        <div style={{padding: '15px 20px', borderBottom: '1px solid #e0e6ed', fontWeight: 'bold', color: '#337ab7', fontSize: '16px'}}>
          PACOTES POR CLIENTE
        </div>
        
        <div style={{padding: '20px'}}>
           <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>

              <div style={{display: 'flex', flexDirection: 'column', gap: '5px', flex: 1}}>
                 <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Cliente</label>
                 <div className="input-group">
                    <input type="text" className="form-control" placeholder="Cliente..." />
                    <button className="btn btn-warning" style={{background: '#d9a138', border: 'none', borderRadius: '0 3px 3px 0', color: 'white'}}>✖</button>
                 </div>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                 <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Status do Pacote</label>
                 <select className="form-control" style={{width: '200px'}}>
                    <option>Em Andamento</option>
                 </select>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                 <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Status do Pagamento</label>
                 <select className="form-control" style={{width: '200px'}}>
                    <option></option>
                 </select>
              </div>

              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                 <button className="btn btn-primary" style={{backgroundColor: '#86649d', borderColor: '#8e44ad', fontWeight: 'bold'}}>▼ FILTRO AVANÇADO</button>
              </div>

           </div>

           <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
              <button className="btn btn-success" style={{backgroundColor: '#26b99a', fontWeight: 'bold', padding: '8px 20px'}}>Q PESQUISAR</button>
              <button className="btn btn-default" style={{backgroundColor: '#e6e9ed', fontWeight: 'bold', color: '#73879C', border: 'none', padding: '8px 20px'}}>LIMPAR</button>
           </div>
        </div>
      </div>
    </div>
  );
}
