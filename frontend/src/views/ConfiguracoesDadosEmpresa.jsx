import { useState } from 'react';
import { Building2, Save, MapPin, Phone, Mail, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { CompanySettings } from '../utils/EntityManager';

export default function ConfiguracoesDadosEmpresa() {
  const [empresa, setEmpresa] = useState(() => CompanySettings.get());
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    CompanySettings.save(empresa);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresa({ ...empresa, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Building2 size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Dados da Empresa
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={empresa.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <label style={{ backgroundColor: '#fff', color: '#0f3d2e', border: '1px solid #0f3d2e', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={16} /> ALTERAR LOGO
              <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
            </label>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Recomendado: JPG ou PNG, 500x500px.</p>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>NOME DA EMPRESA</label>
                <input name="nome" value={empresa.nome} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>CNPJ</label>
                <input name="cnpj" value={empresa.cnpj} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>EMAIL DE CONTATO</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input name="email" value={empresa.email} onChange={handleChange} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>TELEFONE / WHATSAPP</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input name="telefone" value={empresa.telefone} onChange={handleChange} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>ENDEREÇO COMPLETO</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input name="endereco" value={empresa.endereco} onChange={handleChange} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>CIDADE</label>
                <input name="cidade" value={empresa.cidade} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>ESTADO</label>
                <input name="estado" value={empresa.estado} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>CEP</label>
                <input name="cep" value={empresa.cep} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
            </div>

            {/* Seção Dados do Profissional Responsável */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ margin: 0, color: '#0f3d2e', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dados do Profissional Responsável</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>PROFISSIONAL RESPONSÁVEL</label>
                  <input name="responsavel" value={empresa.responsavel || ''} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>CPF DO PROFISSIONAL</label>
                  <input name="cpf" value={empresa.cpf || ''} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>COREN</label>
                  <input name="coren" value={empresa.coren || ''} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>CREFITO</label>
                  <input name="crefito" value={empresa.crefito || ''} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>INSTAGRAM</label>
                  <input name="instagram" value={empresa.instagram || ''} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
              {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} /> Dados salvos com sucesso!
                </div>
              )}
              <button type="submit" style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '12px 40px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(15,61,46,0.2)' }}>
                <Save size={18} /> SALVAR DADOS
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
