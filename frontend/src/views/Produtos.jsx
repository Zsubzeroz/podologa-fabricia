import { useState } from 'react';

export default function Produtos() {
  const [services, setServices] = useState(() => {
    const saved = window.localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'AVALIAÇÃO', duration: '1h 00min', price: 'R$ 50,00', professional: 'FABRICIA RODRIGUES' },
      { id: 2, name: 'CALOS E CALOSIDADE', duration: '1h 00min', price: 'Consulte', professional: 'FABRICIA RODRIGUES' },
      { id: 3, name: 'ONICOCRIPTOSE (UNHA ENCRAVADA)', duration: '1h 00min', price: 'Consulte', professional: 'FABRICIA RODRIGUES' },
      { id: 4, name: 'PODOROFILAXIA (limpeza)', duration: '30min', price: 'R$ 70,00', professional: 'FABRICIA RODRIGUES' },
      { id: 5, name: 'VERRUGA PLANTAR (olho de peixe)', duration: '30min', price: 'Consulte', professional: 'FABRICIA RODRIGUES' }
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal Inputs
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const saveToLocalStorage = (list) => {
    setServices(list);
    window.localStorage.setItem('services', JSON.stringify(list));
  };

  const handleOpenAddModal = () => {
    setName('');
    setDuration('1h 00min');
    setPrice('Consulte');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (service) => {
    setName(service.name);
    setDuration(service.duration);
    setPrice(service.price);
    setEditId(service.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      const updated = services.map(s => s.id === editId ? { ...s, name, duration, price } : s);
      saveToLocalStorage(updated);
    } else {
      const newService = {
        id: Date.now(),
        name,
        duration,
        price,
        professional: 'FABRICIA RODRIGUES'
      };
      saveToLocalStorage([...services, newService]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir este serviço?')) {
      const filtered = services.filter(s => s.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="sa-page-header" style={{ background: '#0f3d2e', color: 'white', padding: '1.2rem', marginBottom: '1rem' }}>
        <h2 className="sa-page-title" style={{ color: 'white', margin: 0 }}>Produtos e Serviços</h2>
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={handleOpenAddModal}
          >
            + NOVO PRODUTO OU SERVIÇO
          </button>
          
          <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Pesquisar por..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ display: 'flex' }}>
            <div style={{ background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px' }}>TOTAL</div>
            <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0' }}>{filteredServices.length} registros</div>
          </div>
        </div>

        <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>NOME</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>DURAÇÃO</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>PREÇO</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>PROFISSIONAL</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', color: '#1f2937', fontWeight: 'bold' }}>{s.name}</td>
                <td style={{ padding: '12px', color: '#4b5563' }}>{s.duration}</td>
                <td style={{ padding: '12px', color: '#1f2937', fontWeight: '600' }}>{s.price}</td>
                <td style={{ padding: '12px', color: '#4b5563' }}>{s.professional}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleOpenEditModal(s)}
                      style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit Service */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSaveService} style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#0f3d2e' }}>{isEditing ? 'Editar Serviço' : 'Novo Serviço'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Nome do Serviço</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Duração</label>
              <input 
                type="text" 
                required 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Preço</label>
              <input 
                type="text" 
                required 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '10px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
