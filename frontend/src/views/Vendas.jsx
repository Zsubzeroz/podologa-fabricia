import { useState } from 'react';

export default function Vendas() {
  const [salesItems, setSalesItems] = useState([]);
  const [clientName, setClientName] = useState('');
  
  const currentTotal = salesItems.reduce((acc, item) => acc + item.price, 0);

  const finalizarDaBaixa = () => {
    alert("Redirecionando para Formas de Pagamento...");
  };

  return (
    <div className="grid-cols-2" style={{gridTemplateColumns: 'minmax(400px, 1.5fr) 1fr', gap: '1.5rem', alignItems: 'start'}}>
      
      <div>
        <div className="card">
          <div className="card-header" style={{backgroundColor: '#428bca', color: 'white', fontWeight: 400}}>
            Informações da Venda
            <button className="btn btn-default" style={{color: '#428bca', padding: '0.3rem 0.6rem'}}>+ NOVA VENDA</button>
          </div>
          <div style={{padding: '1rem'}}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label" style={{fontWeight: 400, color: '#666'}}>Código *</label>
                <input type="text" className="form-control" placeholder="Novo" disabled style={{backgroundColor: '#eee'}} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{fontWeight: 400, color: '#666'}}>Data *</label>
                <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{fontWeight: 400, color: '#666'}}>Total</label>
              <input type="text" className="form-control" placeholder="R$ 0,00" value={`R$ ${currentTotal.toFixed(2).replace('.', ',')}`} style={{backgroundColor: '#eee', color: '#555', fontSize: '1.1rem'}} disabled />
            </div>

            <button style={{width: '100%', padding: '0.8rem', backgroundColor: '#ec971f', color: 'white', border: '1px solid #d58512', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem'}} onClick={finalizarDaBaixa}>
              $ FORMAS DE PAGAMENTO
            </button>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        
        <div className="card">
          <div className="card-header" style={{backgroundColor: '#428bca', color: 'white', fontWeight: 400}}>Item de Venda</div>
          <div style={{padding: '1rem'}}>
            <div style={{padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', color: '#555', backgroundColor: '#f9f9f9'}}>
              Nenhuma venda registrada.
            </div>
            
            <div style={{marginTop: '1rem'}} className="input-group">
               <select className="form-control" onChange={(e)=>{
                 if(e.target.value) {
                   setSalesItems([{id:1, name: e.target.value, price: 80}]);
                 }
               }}>
                  <option value="">Selecione para add...</option>
                  <option value="Avaliação">Avaliação</option>
                  <option value="Podoprofilaxia">Podoprofilaxia</option>
               </select>
               <button className="btn btn-primary" style={{borderRadius: '0 4px 4px 0'}}>+</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{backgroundColor: '#428bca', color: 'white', fontWeight: 400}}>Cliente</div>
          <div style={{padding: '1rem'}}>
            <div className="input-group form-group">
              <input type="text" className="form-control" placeholder="Cliente..." value={clientName} onChange={(e) => setClientName(e.target.value)}/>
              <button className="btn " style={{backgroundColor: '#5bc0de', color: 'white', border: '1px solid #46b8da', borderRadius: '0 4px 4px 0'}}>Q</button>
            </div>
            <div className="grid-cols-2">
              <div className="input-group">
                <div className="input-group-addon">( _ )</div>
                <input type="text" className="form-control" />
              </div>
              <select className="form-control"><option>Consumidor</option></select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
