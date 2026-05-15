import { db } from './firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

/**
 * EntityManager handles the persistent data of the application using OOP principles.
 * Now synced with Firebase Realtime Database (Firestore).
 */
class EntityManager {
  constructor(key) {
    this.key = key;
    this.initSync();
  }

  initSync() {
    try {
      const docRef = doc(db, 'appData', this.key);
      
      // Initial fetch and merge
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data().items && docSnap.data().items.length > 0) {
          // Firebase is the source of truth, update local
          window.localStorage.setItem(this.key, JSON.stringify(docSnap.data().items));
        } else {
          // Firebase empty, push local if exists
          const localData = window.localStorage.getItem(this.key);
          if (localData) {
            const items = JSON.parse(localData);
            if (items.length > 0) {
              setDoc(docRef, { items }).catch(console.error);
            }
          }
        }

        // Listen for real-time changes
        onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const remoteItems = snapshot.data().items || [];
            window.localStorage.setItem(this.key, JSON.stringify(remoteItems));
            // Dispatch event to optionally reload UI if needed
            window.dispatchEvent(new CustomEvent('dataSync', { detail: this.key }));
          }
        });
      }).catch(err => console.warn("Firebase sync error for", this.key, err));
    } catch (e) {
      console.warn("Firebase not fully initialized yet:", e);
    }
  }

  getAll() {
    const data = window.localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(items) {
    window.localStorage.setItem(this.key, JSON.stringify(items));
    // Push to Firebase
    try {
      const docRef = doc(db, 'appData', this.key);
      setDoc(docRef, { items }).catch(console.error);
    } catch (e) {
      console.warn("Failed to save to firebase", e);
    }
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
export const AuditManager = new EntityManager('audit_logs');
export const BlockedDaysManager = new EntityManager('blockedDays');

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

  static log(acao, cliente, detalhe) {
    const user = this.getCredentials().email.split('@')[0];
    AuditManager.add({
      data: new Date().toLocaleString(),
      usuario: user.charAt(0).toUpperCase() + user.slice(1),
      acao,
      cliente,
      detalhe
    });
  }
}

class SettingsManager {
  constructor(key, defaultData) {
    this.key = key;
    this.defaultData = defaultData;
    this.initSync();
  }
  
  initSync() {
    try {
      const docRef = doc(db, 'appSettings', this.key);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          console.log(`[EntityManager] Loading ${this.key} from Cloud`);
          window.localStorage.setItem(this.key, JSON.stringify(docSnap.data()));
          window.dispatchEvent(new CustomEvent('dataSync', { detail: this.key }));
        } else {
          console.log(`[EntityManager] Cloud empty for ${this.key}, uploading local`);
          const localData = window.localStorage.getItem(this.key);
          if (localData) {
            setDoc(docRef, JSON.parse(localData)).catch(console.error);
          } else {
            setDoc(docRef, this.defaultData).catch(console.error);
          }
        }
        onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const cloudData = snapshot.data();
            const localDataStr = window.localStorage.getItem(this.key);
            if (localDataStr !== JSON.stringify(cloudData)) {
              console.log(`[EntityManager] Remote update for ${this.key}`);
              window.localStorage.setItem(this.key, JSON.stringify(cloudData));
              window.dispatchEvent(new CustomEvent('dataSync', { detail: this.key }));
            }
          }
        });
      }).catch(err => console.warn(`[EntityManager] Error syncing ${this.key}:`, err));
    } catch (e) {
      console.warn(`[EntityManager] Firebase not ready for ${this.key}:`, e);
    }
  }

  get() {
    const saved = window.localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : this.defaultData;
  }

  save(data) {
    window.localStorage.setItem(this.key, JSON.stringify(data));
    try {
      const docRef = doc(db, 'appSettings', this.key);
      setDoc(docRef, data).catch(console.error);
    } catch (e) {
      console.warn("Settings save error:", e);
    }
  }
}

export const CompanySettingsManager = new SettingsManager('dados_empresa', {
  nome: 'Fabrícia Rodrigues Saúde Bem-Estar',
  cnpj: '00.000.000/0001-00',
  endereco: 'R. Papa João Paulo II, 256',
  bairro: 'Orlando Corrêa Barbosa',
  cidade: 'Artur Nogueira',
  estado: 'SP',
  cep: '13164-114',
  logo: '/logo.png'
});

export class CompanySettings {
  static get() { return CompanySettingsManager.get(); }
  static save(data) { CompanySettingsManager.save(data); }
}

export const GeneralSettingsManager = new SettingsManager('configuracoes_gerais', {
  calendarioVertical: false,
  obrigarSala: false,
  enviarLembrete: true,
  tempoLembrete: '24',
  mensagemLembrete: 'Olá @CLIENTE, passando para confirmar seu atendimento de @NOMESERVICO no dia @DIA às @HORA. Por favor, responda "SIM" para confirmar ou nos avise se precisar desmarcar. Atenciosamente, @NOMEEMPRESA.',
  mensagemEmail: 'Olá @CLIENTE, seu agendamento de @NOMESERVICO na @NOMEEMPRESA foi confirmado com sucesso para o dia @DIA às @HORA. Solicitamos pontualidade de até 10 minutos. Agradecemos a preferência!'
});

export class GeneralSettings {
  static get() { return GeneralSettingsManager.get(); }
  static save(data) { GeneralSettingsManager.save(data); }
}

export const WorkingHoursManager = new SettingsManager('workingHours', { start: '08:00', end: '19:00' });
export class WorkingHours {
  static get() { return WorkingHoursManager.get(); }
  static save(data) { WorkingHoursManager.save(data); }
}
