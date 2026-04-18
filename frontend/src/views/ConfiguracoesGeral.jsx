export default function ConfiguracoesGeral() {
  return (
    <div style={{padding: '20px', background: '#f9fafc', minHeight: '100vh'}}>
      
      {/* SEÇÃO GERAL */}
      <div style={{color: '#337ab7', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px'}}>
        CONFIGURAÇÃO DO SIMPLES AGENDA
      </div>

      <div className="card" style={{border: '1px solid #e0e6ed', background: 'white', padding: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
         
         <div style={{display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
            <div style={{flex: 1, color: '#666', fontSize: '14px'}}>Mostrar o calendário na vertical ?</div>
            <div style={{flex: 1}}>
               <div style={{display: 'inline-flex', borderRadius: '3px', overflow: 'hidden', border: '1px solid #ddd'}}>
                  <button style={{padding: '5px 15px', border: 'none', background: '#eee'}}>SIM</button>
                  <button style={{padding: '5px 15px', border: 'none', background: '#d9534f', color: 'white'}}>NÃO</button>
               </div>
            </div>
            <div style={{flex: 2, background: '#fcf8e3', borderLeft: '4px solid #faebcc', padding: '15px', fontSize: '13px', color: '#8a6d3b'}}>
               Caso marcado como SIM, o calendário mostrará os profissionais na vertical. O padrão utilizado é na horizontal (parâmetro igual NÃO).<br/><br/>
               Normalmente esta opção é utilizada quando a empresa possui muitos profissionais.
            </div>
         </div>

         <div style={{display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
            <div style={{flex: 1, color: '#666', fontSize: '14px'}}>Obrigar o preenchimento da sala?</div>
            <div style={{flex: 1}}>
               <div style={{display: 'inline-flex', borderRadius: '3px', overflow: 'hidden', border: '1px solid #ddd'}}>
                  <button style={{padding: '5px 15px', border: 'none', background: '#eee'}}>SIM</button>
                  <button style={{padding: '5px 15px', border: 'none', background: '#d9534f', color: 'white'}}>NÃO</button>
               </div>
            </div>
            <div style={{flex: 2, background: '#fcf8e3', borderLeft: '4px solid #faebcc', padding: '15px', fontSize: '13px', color: '#8a6d3b'}}>
               Caso marcado como SIM, o sistema obrigará o preenchimento da Sala (caso houver alguma).<br/>O cadastro da sala fica no menu Cadastros Gerais {'>'} Salas.
            </div>
         </div>

      </div>

      {/* SEÇÃO SMS */}
      <div style={{color: '#337ab7', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px'}}>
        SMS DOS AGENDAMENTOS <span style={{color: '#3498db', fontSize: '14px', cursor: 'pointer'}}>?</span>
      </div>

      <div className="card" style={{border: '1px solid #e0e6ed', background: 'white', padding: '20px', marginBottom: '30px'}}>
         <div style={{display: 'flex', gap: '40px', marginBottom: '30px'}}>
            <div>
               <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Enviar SMS</label><br/>
               <div style={{display: 'inline-flex', borderRadius: '3px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '5px'}}>
                  <button style={{padding: '5px 15px', border: 'none', background: '#eee'}}>SIM</button>
                  <button style={{padding: '5px 15px', border: 'none', background: '#d9534f', color: 'white'}}>NÃO</button>
               </div>
            </div>
            <div>
               <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Tempo SMS</label><br/>
               <input type="text" className="form-control" defaultValue="06:00" style={{width: '100px', marginTop: '5px'}}/>
            </div>
            <div style={{flex: 1, background: '#fcf8e3', borderLeft: '4px solid #faebcc', padding: '15px', fontSize: '13px', color: '#8a6d3b'}}>
               <b>Exemplo Tempo SMS:</b> Informando 04:00 - Agendamento para o dia 21/01 às 18h00 o cliente receberá a mensagem no dia 21/01 às 14h00.
            </div>
         </div>

         <div style={{color: '#337ab7', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
           DEFINA A MENSAGEM QUE SEU CLIENTE RECEBERÁ
         </div>

         <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
               <label style={{fontSize: '13px', color: '#666'}}>Mensagem</label>
               <textarea className="form-control" rows="4" defaultValue="Ola @Cliente, voce tem @NomeServico com @NomeEmpresa, dia @Dia as @Hora, caso tenha qualquer imprevisto por favor nos avise."></textarea>
               <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                  <span style={{background: '#26b99a', color: 'white', padding: '3px 8px', borderRadius: '3px', fontSize: '11px'}}>@CLIENTE</span>
                  <span style={{background: '#26b99a', color: 'white', padding: '3px 8px', borderRadius: '3px', fontSize: '11px'}}>@NOMEEMPRESA</span>
                  <span style={{background: '#26b99a', color: 'white', padding: '3px 8px', borderRadius: '3px', fontSize: '11px'}}>@NOMESERVICO</span>
               </div>
            </div>
            <div style={{flex: 1}}>
               <label style={{fontSize: '13px', color: '#666'}}>Exemplo Pré-Visualização</label>
               <div style={{background: '#f9f9f9', border: '1px solid #eee', padding: '15px', color: '#777', borderRadius: '3px', minHeight: '90px'}}>
                  Ola Maria, voce tem Consulta com Clínica Fabrícia Rodrigues, dia 16/04 as 18:00 , caso tenha qualquer imprevisto por favor nos avise.
               </div>
               <div style={{textAlign: 'right', marginTop: '10px'}}>
                  <button className="btn btn-primary" style={{backgroundColor: '#3498db'}}>✔ RESTAURAR PADRÃO</button>
               </div>
            </div>
         </div>
      </div>

      {/* SEÇÃO WHATSAPP */}
      <div style={{color: '#337ab7', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px'}}>
        WHATSAPP AUTOMÁTICO DOS AGENDAMENTOS <span style={{color: '#3498db', fontSize: '14px', cursor: 'pointer'}}>?</span>
      </div>

      <div className="card" style={{border: '1px solid #e0e6ed', background: 'white', padding: '20px', marginBottom: '30px'}}>
         <div style={{display: 'flex', gap: '30px', marginBottom: '30px'}}>
            <div style={{flex: 1}}>
               <div style={{display: 'flex', gap: '20px'}}>
                  <div>
                     <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Enviar WhatsApp</label><br/>
                     <div style={{display: 'inline-flex', borderRadius: '3px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '5px'}}>
                        <button style={{padding: '5px 15px', border: 'none', background: '#26b99a', color: 'white'}}>SIM</button>
                        <button style={{padding: '5px 15px', border: 'none', background: '#eee'}}>NÃO</button>
                     </div>
                  </div>
                  <div>
                     <label style={{fontSize: '13px', color: '#666', fontWeight: 'bold'}}>Tempo WhatsApp</label><br/>
                     <input type="text" className="form-control" defaultValue="24:00" style={{width: '120px', marginTop: '5px'}}/>
                  </div>
               </div>

               <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                  <button className="btn btn-success" style={{background: '#26b99a'}}>Gerar QR CODE</button>
                  <button className="btn btn-default">Status da Integração</button>
               </div>

               <div style={{background: '#dff0d8', color: '#3c763d', padding: '10px', marginTop: '15px', borderRadius: '3px', fontWeight: 'bold'}}>
                  <span style={{marginRight: '5px'}}>✆</span> Status: Conectado
               </div>
            </div>

            <div style={{flex: 1.5, display: 'flex', flexDirection: 'column', gap: '10px'}}>
               <div style={{background: '#fcf8e3', borderLeft: '4px solid #faebcc', padding: '10px', fontSize: '13px', color: '#8a6d3b'}}>
                  <b>Exemplo Tempo WhatsApp:</b> Informando 04:00, caso o agendamento seja para 18h00, o cliente receberá a mensagem às 14h00.
               </div>
               <div style={{background: '#f2dede', borderLeft: '4px solid #ebccd1', padding: '10px', fontSize: '13px', color: '#a94442'}}>
                  <b>IMPORTANTE:</b> Os agendamentos realizados antes de ativar o envio de WhatsApp...
               </div>
               <div style={{background: '#d9edf7', borderLeft: '4px solid #bce8f1', padding: '10px', fontSize: '13px', color: '#31708f'}}>
                  <b>DICAS:</b> Coloque o seu Telefone e também o Endereço do seu estabelecimento na mensagem.
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
