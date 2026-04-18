import { useState } from 'react';

export default function Caixa() {
  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Caixa</h2>
      </div>
      <div style={{padding: '20px'}} className="grid-cols-2">
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div className="info-box" style={{borderColor: '#337ab7'}}>
             <div className="info-box-header" style={{backgroundColor: '#337ab7'}}><i className="fa fa-user"></i> Cliente</div>
             <div className="input-group form-control" style={{padding:0, border:'none', marginBottom:'10px'}}>
               <input type="text" className="form-control" placeholder="Cliente..." />
               <button className="btn btn-primary" style={{borderRadius:'0 4px 4px 0'}}>Q</button>
             </div>
             <div className="input-group">
               <div style={{padding:'6px', background:'#eee', border:'1px solid #ccc', borderRadius:'3px 0 0 3px'}}>( ) -</div>
               <input type="text" className="form-control" style={{borderRadius:'0'}} />
               <select className="form-control" style={{borderRadius:'0 3px 3px 0'}}></select>
             </div>
          </div>

          <div className="info-box" style={{borderColor: '#337ab7'}}>
             <div className="info-box-header" style={{backgroundColor: '#337ab7'}}>Produtos / Serviços</div>
             <div className="input-group form-control" style={{padding:0, border:'none', marginBottom:'10px'}}>
               <input type="text" className="form-control" placeholder="Informe Produto/Serviço..." />
               <button className="btn btn-primary" style={{borderRadius:'0 4px 4px 0'}}>Q</button>
             </div>
             <select className="form-control" style={{marginBottom: '10px'}}><option>Fabricia Rodrigues Pereira</option></select>
             <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
                <input type="text" className="form-control" placeholder="Preço.." />
                <div style={{padding:'6px 10px', background:'#eee', border:'1px solid #ccc'}}>X</div>
                <input type="text" className="form-control" defaultValue="1" style={{width: '60px'}}/>
             </div>
             <input type="text" className="form-control" placeholder="Observação" style={{marginBottom: '10px'}} />
             <button className="btn btn-success" style={{width: '100%'}}>+ INCLUIR NA VENDA</button>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div className="info-box" style={{borderColor: '#337ab7'}}>
             <div className="info-box-header" style={{backgroundColor: '#337ab7', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Informações da Venda
                <button className="btn btn-default" style={{color: '#337ab7', padding: '2px 8px', fontSize: '12px'}}>+ NOVA VENDA</button>
             </div>
             <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <div style={{flex: 1}}>
                  <label style={{fontSize:'12px', color:'#777'}}>Código *</label>
                  <input type="text" className="form-control" placeholder="Novo" disabled style={{background: '#eee'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize:'12px', color:'#777'}}>Data *</label>
                  <input type="text" className="form-control" defaultValue="16/04/2026" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize:'12px', color:'#777'}}>Total</label>
                  <input type="text" className="form-control" defaultValue="R$ 0,00" disabled style={{background: '#eee'}} />
                </div>
             </div>
             <button style={{width: '100%', background: '#f0ad4e', color: 'white', border: '1px solid #eea236', padding: '10px', fontWeight: 'bold', borderRadius: '3px', marginBottom: '15px'}}>
                $ FORMAS DE PAGAMENTO
             </button>
             
             <div style={{fontSize: '12px', color: '#555'}}>
                PODOPROFILAXIA - ?corte correto? limpeza das cutículas? higienização? calosidades? fissura? exfoliação? lix<br/>
                <input type="text" className="form-control" defaultValue="PODOPROFILAXIA=?corte corr" style={{marginTop:'5px'}} />
             </div>
          </div>

          <div className="info-box" style={{borderColor: '#337ab7'}}>
             <div className="info-box-header" style={{backgroundColor: '#337ab7'}}>Item de Venda</div>
             <div style={{textAlign: 'center', padding: '20px', color: '#555', border: '1px solid #ddd'}}>
                Nenhuma venda registrada.
             </div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div className="info-box">
             <div className="info-box-header" style={{backgroundColor: '#34495e'}}>Caixa 2 - 28/10</div>
             <div className="grid-cols-2" style={{gap: '10px', marginBottom: '15px'}}>
                <button className="btn btn-default" style={{width:'100%'}}>RESUMO</button>
                <button className="btn btn-danger" style={{width:'100%'}}>EXCLUIR CAIXA</button>
                <button className="btn btn-default" style={{width:'100%'}}>↓ SUPRIMENTO</button>
                <button className="btn btn-default" style={{width:'100%'}}>↑ SANGRIA</button>
                <button className="btn btn-default" style={{width:'100%'}}>A DESPESA</button>
                <button className="btn btn-default" style={{width:'100%'}}>FECHAR CAIXA</button>
             </div>
             <div style={{background: '#9b59b6', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '3px', fontSize: '13px', marginBottom: '5px'}}>
               <strong style={{display:'block'}}>ATENÇÃO</strong>
               O caixa está aberto desde o dia 28/10.
             </div>
             <div style={{fontSize:'11px', color:'#337ab7', textAlign:'center'}}>Precisando de ajuda com o Caixa? Clique aqui.</div>
          </div>

          <div className="info-box">
             <div className="info-box-header" style={{backgroundColor: '#34495e'}}>Lembrete a Receber</div>
             <div style={{display: 'flex', gap: '5px'}}>
                <button className="btn btn-danger" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>HOJE</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>ONTEM</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>SEMANA</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>MÊS</button>
             </div>
          </div>

          <div className="info-box">
             <div className="info-box-header" style={{backgroundColor: '#34495e'}}>Vendas Recebidas</div>
             <div style={{display: 'flex', gap: '5px'}}>
                <button className="btn btn-success" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>HOJE</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>ONTEM</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>SEMANA</button>
                <button className="btn btn-default" style={{flex: 1, padding: '5px 0', fontSize:'11px'}}>MÊS</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
