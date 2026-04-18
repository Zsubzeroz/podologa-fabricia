export default function ConfiguracoesDadosEmpresa() {
  return (
    <div style={{padding: '20px', background: '#f9fafc', minHeight: '100vh'}}>
      <div style={{color: '#337ab7', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px'}}>
        DADOS DA EMPRESA
      </div>

      <div className="card" style={{border: '1px solid #e0e6ed', background: 'white', overflow: 'hidden'}}>
        
        {/* Tabs */}
        <div style={{display: 'flex', borderBottom: '1px solid #e0e6ed'}}>
          <div style={{padding: '10px 20px', color: '#555', borderTop: '2px solid #d9534f', fontWeight: 'bold', borderRight: '1px solid #e0e6ed'}}>
             Geral
          </div>
          <div style={{padding: '10px 20px', color: '#337ab7', cursor: 'pointer', borderRight: '1px solid #e0e6ed'}}>
             Endereço
          </div>
          <div style={{padding: '10px 20px', color: '#337ab7', cursor: 'pointer'}}>
             Fiscal
          </div>
        </div>

        {/* Content */}
        <div style={{padding: '20px', display: 'flex', gap: '30px'}}>
           
           {/* Logo Upload Box */}
           <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '250px'}}>
              <div style={{border: '1px solid #ddd', padding: '20px', textAlign: 'center', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <img src="/Logo.jpeg" alt="Logo Clínica" style={{maxWidth: '100%', maxHeight: '100%'}} />
              </div>
              <div style={{display: 'flex', gap: '5px'}}>
                 <button className="btn btn-success" style={{flex: 1, backgroundColor: '#26b99a', fontWeight: 'bold', padding: '8px', fontSize: '12px'}}>+ ADICIONAR</button>
                 <button className="btn btn-danger" style={{flex: 1, backgroundColor: '#d9534f', fontWeight: 'bold', padding: '8px', fontSize: '12px'}}>🗑 EXCLUIR</button>
              </div>
           </div>

           {/* Form Box */}
           <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '15px'}}>
              
              <div style={{display: 'flex', gap: '15px'}}>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Código</label>
                    <input type="text" className="form-control" defaultValue="94867" disabled style={{background: '#eee'}} />
                 </div>
                 <div style={{flex: 3}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Nome da Empresa*</label>
                    <input type="text" className="form-control" defaultValue="Clínica Fabrícia Rodrigues" />
                 </div>
                 <div style={{flex: 2}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Nome do Responsável*</label>
                    <input type="text" className="form-control" defaultValue="Fabricia Rodrigues" />
                 </div>
              </div>

              <div style={{display: 'flex', gap: '15px'}}>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Celular*</label>
                    <input type="text" className="form-control" defaultValue="(19) 99727-0910" />
                 </div>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Comercial</label>
                    <input type="text" className="form-control" />
                 </div>
                 <div style={{flex: 2}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Email</label>
                    <input type="text" className="form-control" defaultValue="fabriciapodologa@gmail.com" />
                 </div>
              </div>

              <div style={{display: 'flex', gap: '15px'}}>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>CNPJ</label>
                    <input type="text" className="form-control" />
                 </div>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>CPF</label>
                    <input type="text" className="form-control" defaultValue="330.301.948-76" />
                 </div>
                 <div style={{flex: 2}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Site</label>
                    <input type="text" className="form-control" defaultValue="@fabriciapodologa" />
                 </div>
              </div>

              <div style={{display: 'flex', gap: '15px'}}>
                 <div style={{flex: 1}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Saldo SMS</label>
                    <input type="text" className="form-control" defaultValue="100" disabled style={{background: '#eee'}} />
                 </div>
                 <div style={{flex: 3}}>
                    <label style={{fontSize: '13px', color: '#666'}}>Espaço Ocupado / Disponível</label>
                    <input type="text" className="form-control" defaultValue="87,58 KB / 1000 MB" disabled style={{background: '#eee'}} />
                 </div>
              </div>

           </div>
        </div>
      </div>
      
      <div style={{marginTop: '20px'}}>
         <button className="btn btn-success" style={{backgroundColor: '#26b99a', fontWeight: 'bold', padding: '10px 20px'}}>✔ SALVAR</button>
      </div>

    </div>
  );
}
