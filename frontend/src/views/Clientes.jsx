import { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState(() => {
    const saved = window.localStorage.getItem('clientes');
    return saved ? JSON.parse(saved) : [
      { nome: 'Adriano Rangel', data: '23/10/2025', contato: '(19) 99381-8556 Outro' },
      { nome: 'Alessandra Rodrigues dos Santos', status: 'CADASTRO INCOMPLETO', data: '16/03/2026', contato: '(19) 99574-5363 Outro' },
      { nome: 'Amanda', status: 'CADASTRO INCOMPLETO', data: '11/12/2025', contato: '(19) 99246-0623 Outro' },
      { nome: 'Amanda Delgado', status: 'CADASTRO INCOMPLETO', data: '15/12/2025', contato: '(19) 97145 4758 Outro' },
      { nome: 'Anderson', status: 'CADASTRO-AGENDA-ONLINE', data: '02/01/2026', contato: '(19) 98298-1492 Outro' },
      { nome: 'Andréa', data: '22/10/2025', contato: '(19) 99798-9924 Outro' },
    ];
  });

  const [showNewModal, setShowNewModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    contato: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    window.localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.contato) {
      alert('Por favor, preencha o nome e o contato do cliente.');
      return;
    }

    if (/\d/.test(formData.nome)) {
      alert('O nome do cliente não deve conter números.');
      return;
    }

    const today = new Date().toLocaleDateString('pt-BR');
    const newClient = {
      nome: formData.nome,
      data: formData.data || today,
      contato: formData.contato,
      status: formData.status || 'ATIVO'
    };

    setClientes([...clientes, newClient]);
    setFormData({ nome: '', data: '', contato: '', status: 'ATIVO' });
    setShowNewModal(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Tem certeza de que deseja excluir este cliente?')) {
      const updated = clientes.filter((_, i) => i !== index);
      setClientes(updated);
    }
  };

  const filtered = clientes.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.contato.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title">Clientes</h2>
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#3fa9f5' }}
            onClick={() => setShowNewModal(true)}
          >
            + NOVO CLIENTE
          </button>
          
          <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Pesquisar por..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex' }}>
             <div style={{ background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px' }}>TOTAL</div>
             <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0' }}>{clientes.length} cliente(s)</div>
          </div>
        </div>

        {/* Modal Novo Cliente */}
        {showNewModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '8px', maxWidth: '450px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Cadastrar Novo Cliente</h3>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Nome do Cliente</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nome completo..." 
                    value={formData.nome} 
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Contato / Telefone</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="(XX) XXXXX-XXXX" 
                    value={formData.contato} 
                    onChange={(e) => {
                      let val = e.target.value;
                      let cleaned = val.replace(/\D/g, '');
                      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
                      let masked = '';
                      if (cleaned.length > 0) masked += `(${cleaned.slice(0, 2)}`;
                      if (cleaned.length > 2) masked += `) ${cleaned.slice(2, 7)}`;
                      if (cleaned.length > 7) masked += `-${cleaned.slice(7, 11)}`;
                      setFormData({ ...formData, contato: masked });
                    }} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Data Cadastro (opcional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: 25/10/2026" 
                    value={formData.data} 
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select 
                    className="form-control" 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>ATIVO</option>
                    <option>CADASTRO INCOMPLETO</option>
                    <option>CADASTRO-AGENDA-ONLINE</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-success" style={{ flex: 1 }}>✓ SALVAR</button>
                  <button type="button" className="btn btn-default" onClick={() => setShowNewModal(false)} style={{ flex: 1 }}>CANCELAR</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>NOME DO CLIENTE</th>
                <th>CADASTRO</th>
                <th>CONTATO</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ color: '#337ab7', fontWeight: 'bold' }}>{c.nome}</span>
                  </td>
                  <td style={{ color: '#555' }}>{c.data}</td>
                  <td style={{ color: '#555' }}>{c.contato}</td>
                  <td>
                    <span style={{ 
                      background: c.status === 'ATIVO' ? '#26b99a' : '#34495e', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '3px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {c.status || 'ATIVO'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-default" style={{ padding: '4px 8px', color: '#d9534f', fontSize: '12px' }} onClick={() => handleDelete(i)}>🗑 Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
