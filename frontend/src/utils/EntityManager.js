/**
 * EntityManager handles the persistent data of the application using OOP principles.
 */
class EntityManager {
  constructor(key) {
    this.key = key;
  }

  getAll() {
    const data = window.localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(items) {
    window.localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(item) {
    const items = this.getAll();
    const newItem = { ...item, id: item.id || Date.now() };
    items.unshift(newItem); // Add to beginning
    this.save(items);
    return newItem;
  }

  remove(id) {
    const items = this.getAll().filter(item => String(item.id) !== String(id));
    this.save(items);
    return items;
  }

  update(id, updatedData) {
    const items = this.getAll().map(item => 
      String(item.id) === String(id) ? { ...item, ...updatedData } : item
    );
    this.save(items);
    return items;
  }
}

export const AppointmentManager = new EntityManager('appointments');
export const ClientManager = new EntityManager('clientes');
export const ReceiptManager = new EntityManager('nfs_list');
export const ProductManager = new EntityManager('produtos_list');
export const ServiceManager = new EntityManager('services');
export const SaleManager = new EntityManager('vendas_list');
export const OrcamentoManager = new EntityManager('orcamentos_list');
export const PacoteManager = new EntityManager('pacotes_list');
export const ProfessionalManager = new EntityManager('professionals_list');

export class SecurityManager {
  static getCredentials() {
    const saved = window.localStorage.getItem('admin_credentials');
    if (saved) return JSON.parse(saved);
    // Default fallback
    return {
      email: 'fabriciapodologa@gmail.com',
      password: '1519am02'
    };
  }

  static setCredentials(email, password) {
    window.localStorage.setItem('admin_credentials', JSON.stringify({ email, password }));
  }

  static verify(email, password) {
    const creds = this.getCredentials();
    return creds.email === email && creds.password === password;
  }
}

export class CompanySettings {
  static get() {
    const saved = window.localStorage.getItem('dados_empresa');
    return saved ? JSON.parse(saved) : {
      nome: 'Fabrícia Rodrigues Saúde Bem-Estar',
      cnpj: '00.000.000/0001-00',
      endereco: 'R. Papa João Paulo II, 256',
      bairro: 'Orlando Corrêa Barbosa',
      cidade: 'Artur Nogueira',
      estado: 'SP',
      cep: '13164-114',
      logo: '/logo.png'
    };
  }

  static save(data) {
    window.localStorage.setItem('dados_empresa', JSON.stringify(data));
  }
}

export class GeneralSettings {
  static get() {
    const saved = window.localStorage.getItem('configuracoes_gerais');
    return saved ? JSON.parse(saved) : {
      calendarioVertical: false,
      obrigarSala: false,
      enviarLembrete: true,
      tempoLembrete: '24',
      mensagemLembrete: 'Olá @CLIENTE, passando para confirmar seu atendimento de @NOMESERVICO no dia @DIA às @HORA. Por favor, responda "SIM" para confirmar ou nos avise se precisar desmarcar. Atenciosamente, @NOMEEMPRESA.'
    };
  }

  static save(data) {
    window.localStorage.setItem('configuracoes_gerais', JSON.stringify(data));
  }
}
