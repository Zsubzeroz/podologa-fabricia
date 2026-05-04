import { useState } from 'react';
import { Package, Search, Plus, Edit, Trash2, X, Clock, DollarSign } from 'lucide-react';

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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Package size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Gestão de Produtos e Serviços
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenAddModal}
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(15,61,46,0.15)',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> NOVO PRODUTO OU SERVIÇO
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filteredServices.length} registros
            </div>
          </div>
        </div>

        {/* Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO SERVIÇO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DURAÇÃO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>PREÇO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>PROFISSIONAL</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum serviço encontrado.</td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{s.name}</td>
                    <td style={{ padding: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={16} color="#6b7280" /> {s.duration}
                    </td>
                    <td style={{ padding: '14px', color: '#0f3d2e', fontWeight: 'bold' }}>{s.price}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{s.professional}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenEditModal(s)}
                          style={{ padding: '8px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          style={{ padding: '8px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Trash2 size={14} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Service */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveService} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Serviço / Produto' : 'Novo Serviço / Produto'}
              </h3>
              <X size={20} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Podoprofilaxia Completa"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Duração</label>
              <input 
                type="text" 
                required 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 1h 00min"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Preço</label>
              <input 
                type="text" 
                required 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: R$ 50,00 ou Consulte"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
