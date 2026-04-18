export default function AlterarSenha() {
  return (
    <div style={{padding: '20px', background: '#f9fafc', minHeight: '100vh'}}>
      <div className="card" style={{border: '1px solid #e0e6ed', borderRadius: '3px', background: 'white', overflow: 'hidden', maxWidth: '600px'}}>
        <div style={{padding: '15px 20px', borderBottom: '1px solid #e0e6ed', fontWeight: 'bold', color: '#337ab7', fontSize: '16px'}}>
          ALTERAR SENHA
        </div>
        
        <div style={{padding: '20px'}}>
           <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              
              <div>
                 <label style={{fontSize: '13px', color: '#666'}}>Senha atual*</label>
                 <input type="password" className="form-control" />
              </div>

              <div>
                 <label style={{fontSize: '13px', color: '#666'}}>Nova Senha*</label>
                 <input type="password" className="form-control" />
              </div>

              <div>
                 <label style={{fontSize: '13px', color: '#666'}}>Confirme a Nova Senha*</label>
                 <input type="password" className="form-control" />
              </div>

           </div>

           <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
              <button className="btn btn-success" style={{backgroundColor: '#26b99a', fontWeight: 'bold', padding: '8px 20px'}}>✔ SALVAR</button>
           </div>
        </div>
      </div>
    </div>
  );
}
