import { useState, useEffect } from 'react';
import { ShoppingCart, User, Plus, Trash2, DollarSign, List, CheckSquare } from 'lucide-react';
import { ClientManager, ServiceManager, SaleManager } from '../utils/EntityManager';

export default function Caixa({ initialClient, initialService }) {
  const [clientes, setClientes] = useState(() => ClientManager.getAll());
  const [services, setServices] = useState(() => ServiceManager.getAll());
  const [vendas, setVendas] = useState(() => SaleManager.getAll());

  const [currentSale, setCurrentSale] = useState({
    cliente: initialClient || '',
    itens: [],
    formaPagamento: 'Dinheiro',
    total: 0
  });

  const [itemForm, setItemForm] = useState({
    nome: '',
    preco: 0,
    quantidade: 1
  });

  useEffect(() => {
    if (services.length > 0 && !itemForm.nome) {
      setItemForm({
        nome: services[0].name,
        preco: parseFloat(services[0].price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        quantidade: 1
      });
    }
  }, [services]);

  useEffect(() => {
    if (initialService && services.length > 0) {
      const found = services.find(s => s.name === initialService);
      if (found) {
        const parsedPrice = parseFloat(found.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const newItem = {
          id: Date.now(),
          nome: found.name,
          preco: parsedPrice,
          quantidade: 1,
          subtotal: parsedPrice
        };
        setCurrentSale(prev => ({
          ...prev,
          itens: [newItem],
          total: parsedPrice
        }));
      }
    }
  }, [initialService, services]);

  useEffect(() => {
    const handleSync = () => {
      setClientes(ClientManager.getAll());
      setServices(ServiceManager.getAll());
      setVendas(SaleManager.getAll());
    };
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemForm.quantidade < 1) return alert('Por favor, informe uma quantidade válida.');
    
    const subtotal = itemForm.preco * itemForm.quantidade;
    const newItem = {
      id: Date.now(),
      nome: itemForm.nome,
      preco: itemForm.preco,
      quantidade: itemForm.quantidade,
      subtotal
    };

    const newItens = [...currentSale.itens, newItem];
    const newTotal = newItens.reduce((sum, item) => sum + item.subtotal, 0);

    setCurrentSale({
      ...currentSale,
      itens: newItens,
      total: newTotal
    });

    setItemForm({
      nome: services[0]?.name || 'Avaliação',
      preco: services[0]?.price ? parseFloat(services[0].price.replace(/[^\d.,]/g, '').replace(',', '.')) : 50,
      quantidade: 1
    });
  };

  const handleRemoveItem = (itemId) => {
    const filtered = currentSale.itens.filter(item => String(item.id) !== String(itemId));
    const newTotal = filtered.reduce((sum, item) => sum + item.subtotal, 0);
    setCurrentSale({
      ...currentSale,
      itens: filtered,
      total: newTotal
    });
  };

  const handleFinalizeSale = () => {
    if (!currentSale.cliente) {
      alert('Por favor, selecione ou informe o cliente para esta venda.');
      return;
    }
    if (currentSale.itens.length === 0) {
      alert('Por favor, adicione pelo menos um item à venda.');
      return;
    }

    const completedSale = {
      ...currentSale,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR')
    };

    const updated = SaleManager.add(completedSale);
    setVendas(updated);
    alert('Venda registrada com sucesso!');

    setCurrentSale({
      cliente: '',
      itens: [],
      formaPagamento: 'Dinheiro',
      total: 0
    });
  };

  const handleClearSale = () => {
    if (window.confirm('Deseja cancelar a venda atual?')) {
      setCurrentSale({
        cliente: '',
        itens: [],
        formaPagamento: 'Dinheiro',
        total: 0
      });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ShoppingCart size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Caixa / Ponto de Venda
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
        {/* Left column: Create sale form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Client select or input */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
              <User size={18} /> 1. Informações do Cliente
            </h4>
            <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Cliente</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Nome do cliente..." 
                className="form-control" 
                value={currentSale.cliente} 
                onChange={(e) => setCurrentSale({ ...currentSale, cliente: e.target.value })} 
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <select 
                onChange={(e) => setCurrentSale({ ...currentSale, cliente: e.target.value })} 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f9fafb' }}
              >
                <option value="">(Clientes cadastrados)</option>
                {clientes.map((c, i) => (
                  <option key={i} value={c.nome}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product and Service Add Item form */}
          <form 
            onSubmit={handleAddItem}
            style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
              <Plus size={18} /> 2. Produtos & Serviços
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Item</label>
                <select 
                  className="form-control"
                  value={itemForm.nome}
                  onChange={(e) => {
                    const found = services.find(s => s.name === e.target.value);
                    const parsedPrice = found && found.price ? parseFloat(found.price.replace(/[^\d.,]/g, '').replace(',', '.')) : 50;
                    setItemForm({ ...itemForm, nome: e.target.value, preco: parsedPrice });
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  {services.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} - {s.price}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Preço Unitário (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    value={itemForm.preco} 
                    onChange={(e) => setItemForm({ ...itemForm, preco: parseFloat(e.target.value) || 0 })} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Quantidade</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={itemForm.quantidade} 
                    onChange={(e) => setItemForm({ ...itemForm, quantidade: parseInt(e.target.value) || 1 })} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-confirm" 
                style={{ 
                  backgroundColor: '#0f3d2e', 
                  color: '#fff', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  width: '100%',
                  marginTop: '6px'
                }}
              >
                + ADICIONAR ITEM À VENDA
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Current sale checkout summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
                <CheckSquare size={18} /> 3. Resumo & Checkout
              </h4>
              <button onClick={handleClearSale} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Limpar Venda
              </button>
            </div>

            <div style={{ flex: 1, border: '1px solid #f3f4f6', padding: '10px', borderRadius: '8px', background: '#f9fafb', marginBottom: '15px', minHeight: '100px', overflowY: 'auto' }}>
              {currentSale.itens.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', margin: '25px 0' }}>Nenhum item adicionado à venda.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentSale.itens.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#111827' }}>{item.nome}</span>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {item.quantidade}x de R$ {item.preco.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ color: '#0f3d2e', fontSize: '0.95rem' }}>R$ {item.subtotal.toFixed(2).replace('.', ',')}</strong>
                        <button onClick={() => handleRemoveItem(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Forma de Pagamento</label>
                  <select 
                    className="form-control" 
                    value={currentSale.formaPagamento}
                    onChange={(e) => setCurrentSale({ ...currentSale, formaPagamento: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  >
                    <option>Dinheiro</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Pix</option>
                  </select>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Total Geral</label>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f3d2e' }}>
                    R$ {currentSale.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleFinalizeSale}
                style={{ 
                  backgroundColor: '#22c55e', 
                  color: '#fff', 
                  padding: '14px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: 'bold', 
                  fontSize: '1.05rem', 
                  cursor: 'pointer', 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(34,197,94,0.2)'
                }}
              >
                <DollarSign size={20} /> FINALIZAR VENDA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History List: Sales Received */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 'bold' }}>
            <List size={20} /> Histórico de Vendas Realizadas
          </h4>
          {vendas.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza de que deseja excluir todo o histórico de vendas?')) {
                  SaleManager.save([]);
                  setVendas([]);
                }
              }}
              style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              Limpar Todo o Histórico
            </button>
          )}
        </div>
        {vendas.length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>Nenhuma venda foi registrada hoje.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>DATA / HORA</th>
                  <th style={{ padding: '12px' }}>CLIENTE</th>
                  <th style={{ padding: '12px' }}>ITENS VENDIDOS</th>
                  <th style={{ padding: '12px' }}>PAGAMENTO</th>
                  <th style={{ padding: '12px' }}>TOTAL</th>
                  <th style={{ padding: '12px' }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map(venda => (
                  <tr key={venda.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontSize: '0.9rem', color: '#4b5563' }}>{venda.data} às {venda.hora}</td>
                    <td style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 'bold', color: '#1f2937' }}>{venda.cliente}</td>
                    <td style={{ padding: '12px', fontSize: '0.85rem', color: '#4b5563' }}>
                      {venda.itens.map((item, idx) => (
                        <div key={idx}>{item.quantidade}x {item.nome}</div>
                      ))}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.9rem', color: '#4b5563' }}>{venda.formaPagamento}</td>
                    <td style={{ padding: '12px', fontSize: '0.95rem', fontWeight: 'bold', color: '#0f3d2e' }}>
                      R$ {venda.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => {
                          if (window.confirm('Tem certeza de que deseja excluir esta venda?')) {
                            const updated = SaleManager.remove(venda.id);
                            setVendas(updated);
                          }
                        }}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
