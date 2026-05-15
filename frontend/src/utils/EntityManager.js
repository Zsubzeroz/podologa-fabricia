import { db } from './firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

/**
 * EntityManager handles the persistent data of the application using OOP principles.
 * Now synced with Firebase Realtime Database (Firestore).
 */
class EntityManager {
  constructor(key, defaultItems = []) {
    this.key = key;
    this.defaultItems = defaultItems;
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
          // Firebase empty, push local or defaults
          const localData = window.localStorage.getItem(this.key);
          if (localData) {
            const items = JSON.parse(localData);
            if (items.length > 0) {
              setDoc(docRef, { items }).catch(console.error);
            }
          } else if (this.defaultItems && this.defaultItems.length > 0) {
            setDoc(docRef, { items: this.defaultItems }).catch(console.error);
            window.localStorage.setItem(this.key, JSON.stringify(this.defaultItems));
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
export const ServiceManager = new EntityManager('services', [
  { name: 'Podoprofilaxia Completa', price: 'R$ 160,00', duration: '01:00' },
  { name: 'Tratamento de Onicocriptose', price: 'R$ 120,00', duration: '00:45' },
  { name: 'Órtese Ungueal', price: 'R$ 80,00', duration: '00:30' },
  { name: 'Curativo/Retorno', price: 'R$ 50,00', duration: '00:20' },
  { name: 'Spa dos Pés', price: 'R$ 190,00', duration: '01:00' }
]);
export const SaleManager = new EntityManager('vendas_list');
export const OrcamentoManager = new EntityManager('orcamentos_list');
export const PacoteManager = new EntityManager('pacotes_list');
export const ProfessionalManager = new EntityManager('professionals_list');
export const AuditManager = new EntityManager('audit_logs');
export const BlockedDaysManager = new EntityManager('blockedDays');
export const PatientFormManager = new EntityManager('patient_forms');
export const AnamnesisTemplateManager = new EntityManager('anamneses_list', [
  { 
    id: 1, 
    nome: 'FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA', 
    status: 'ATIVO',
    conteudo: `FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA\n\nNome: __________________________________________________\nE-mail: _________________________________________________\nEndereço: _______________________________________________\nFone: ( ) _________________ Idade: ______\n\nAVALIAÇÃO FÍSICA\n\nCalçado mais utilizado: ( ) Aberto ( ) Fechado  Nº ______\nMeia mais utilizada: ( ) Social ( ) Esportiva\nCirurgia nos membros inferiores? ( ) SIM ( ) NÃO Especifique: ___________________\nPratica Esportes? ( ) SIM ( ) NÃO Especifique: _______________________________\nFaz uso de algum medicamento? ( ) SIM ( ) NÃO Especifique: ___________________\nGestante? ( ) NÃO ( ) SIM / Semanas ________\nSensibilidade a dor? ( ) NÃO ( ) SIM Especifique: ____________________________\nTem hipo/hipertensão arterial? ( ) NÃO ( ) SIM\nDiabetes? ( ) NÃO ( ) SIM\nPortador de marcapasso/pinos? ( ) NÃO ( ) SIM\nHanseníase? ( ) NÃO ( ) SIM\nCardiopatia? ( ) NÃO ( ) SIM\nHepatite? ( ) NÃO ( ) SIM\nDistúrbio circulatório? ( ) NÃO ( ) SIM\nHistórico de câncer? ( ) NÃO ( ) SIM\n\nObservações Profissionais:\nPD: ____________________________________________________________________\nPE: ____________________________________________________________________\nPROCEDIMENTO: __________________________________________________________\n\nPATOLOGIAS DERMATOLÓGICAS PRESENTES:\n( ) FISSURAS  ( ) HIPERIDROSE  ( ) DESIDROSE  ( ) BROMIDOSE  ( ) HIPERQUERATOSE\n( ) PSORÍASE  ( ) TINEA PEDIS  ( ) TINEA INTERDIGITAL  ( ) ONICOMICOSE  ( ) ONICOCRIPTOSE\n( ) ONICOFOSE ( ) EXOSTOSE   ( ) GRANULOMA  ( ) OUTRO: ______________________\n\nFORMATOS UNGUEAIS:\n( ) Normal  ( ) Funil  ( ) Involuta  ( ) Telha  ( ) Cunha  ( ) Gancho  ( ) Torquês  ( ) Caracol\n\nDATA: ____/____/______   Ass.: _______________`
  },
  { 
    id: 2, 
    nome: 'TERMO DE RESPONSABILIDADE', 
    status: 'ATIVO',
    conteudo: `TERMO DE RESPONSABILIDADE\n\nEu, _________________________________ CPF: ________________________________, declaro ter sido informado(a) e esclarecido(a) sobre os procedimentos envolvidos. Declaro que todas as informações sobre minha pessoa e cadastro clínico são de minha inteira veracidade e responsabilidade legal, não omitindo qualquer informação. Declaro também que cumprirei com as normas dos procedimentos indicados para o bom andamento do tratamento podológico. E cumprirei com os horários agendados e na impossibilidade avisarei com antecedência de 24 horas.\n\nAssinatura do Paciente: _________________________________\nData: ____/____/______`
  },
  {
    id: 8,
    nome: 'PRONTUÁRIO ESPECIALIZADO: PÉ DIABÉTICO',
    status: 'ATIVO',
    conteudo: `PRONTUÁRIO ESPECIALIZADO: PÉ DIABÉTICO\nAVALIAÇÃO INTEGRADA (PODOLOGIA & ENFERMAGEM CLÍNICA)\nResponsável: Fabrícia Rodrigues | Artur Nogueira - SP\n\n1. DADOS DO PACIENTE E CONTROLE GLICÊMICO\nNome: _________________________________________________ Data: ___/___/___\nTipo de DM: ( ) Tipo 1 ( ) Tipo 2 Tempo de Diagnóstico: ________ Última HGT: ________ mg/dL\nHbA1c recente: ________ % Insulinodependente: ( ) Sim ( ) Não Tabagista: ( ) Sim ( ) Não\n\n2. AVALIAÇÃO DE ENFERMAGEM (SINAIS VITAIS E SISTÊMICOS)\nPA: ________ x ________ mmHg FC: ________ bpm FR: ________ irpm Temp: ________ °C\nEdema: ( ) Ausente ( ) +/4+ ( ) ++/4+ ( ) +++/4+ | Cacifo (Sinal de Godet): ( ) Positivo ( ) Negativo\nPerfusão Periférica: ( ) < 3 seg ( ) > 3 seg | Varizes: ( ) Sim ( ) Não\n\n3. EXAME FÍSICO PODOLÓGICO E NEUROLÓGICO\nTestes de Sensibilidade | Pé Direito | Pé Esquerdo\nMonofilamento (10g): ( ) Presente ( ) Ausente | ( ) Presente ( ) Ausente\nVibratória (Diapasão 128Hz): ( ) Presente ( ) Ausente | ( ) Presente ( ) Ausente\nPulso Pedioso / Tibial Posterior: ( ) Normal ( ) Diminuído ( ) Ausente | ( ) Normal ( ) Diminuído ( ) Ausente\n\n4. CLASSIFICAÇÃO DE RISCO E LESÕES (ESCALA DE WAGNER)\nGrau: ( ) 0 - Sem lesão aparente ( ) 1 - Úlcera Superficial ( ) 2 - Úlcera Profunda ( ) 3 - Abscesso/Osteomielite\nDeformidades: ( ) Hálux Valgo ( ) Dedos em Garra ( ) Charcot ( ) Proeminências Ósseas\nAlterações de Pele: ( ) Anidrose ( ) Fissuras ( ) Micose ( ) Calo com Hemorragia Subjacente\n\n5. CONDUTA E PLANEJAMENTO DE CUIDADO\n( ) Podoprofilaxia ( ) Desbridamento Mecânico ( ) Curativo Especial: __________________________\n( ) Encaminhamento Médico/Vascular ( ) Educação em Saúde: __________________________\nEvolução: __________________________________________________________________________\n\nAssinatura do Paciente: __________________________________________\nFabrícia Rodrigues - Podóloga/Enfermagem: __________________________________________`
  }
]);
export const FinanceManager = new EntityManager('financeiro_entries');

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
