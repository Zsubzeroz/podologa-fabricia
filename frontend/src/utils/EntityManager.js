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
    nome: 'FICHA DE AVALIAÇÃO CLÍNICA: PÉ DIABÉTICO',
    status: 'ATIVO',
    conteudo: `FICHA DE AVALIAÇÃO CLÍNICA: PÉ DIABÉTICO (IWGDF)\n\n1. IDENTIFICAÇÃO E CONTROLE GLICÊMICO\nNome: _________________________________________________ Data: __/__/__\nTempo de Diagnóstico DM: ________ Última HGT: ________ HbA1c recente: ________\nComorbidades: ( ) HAS ( ) Dislipidemia ( ) Tabagismo ( ) Doença Renal\n\n2. ANAMNESE DIRIGIDA\nHistórico de Úlceras Prévias? ( ) Sim ( ) Não | Amputações? ( ) Sim ( ) Não\nSintomas Neuropáticos: ( ) Queimação ( ) Formigamento ( ) Dormência ( ) Dor Noturna\nClaudicação Intermitente (Dor ao caminhar): ( ) Sim ( ) Não\n\n3. EXAME VASCULAR (Sinais de Doença Arterial Periférica)\nPulsos Pediosos: ( ) Presente ( ) Diminuído ( ) Ausente (D/E)\nPulsos Tibiais Posteriores: ( ) Presente ( ) Diminuído ( ) Ausente (D/E)\nTemperatura: ( ) Normal ( ) Fria (Isquemia) ( ) Quente (Inflamação/Charcot)\nTempo de Enchimento Capilar: ( ) Normal (<3s) ( ) Prolongado (>3s)\nPele: ( ) Fina/Brilhante ( ) Ausência de pelos ( ) Cianose ( ) Palidez à elevação\n\n4. EXAME NEUROLÓGICO (Teste de Sensibilidade)\nMonofilamento de Semmes-Weinstein (10g): Marque (V) para sente e (X) para não sente:\nHálux: ( ) 1º Metatarso: ( ) 3º Metatarso: ( ) 5º Metatarso: ( ) Calcâneo: ( )\nSensibilidade Vibratória (Diapasão 128Hz): ( ) Preservada ( ) Diminuída ( ) Ausente\nSensibilidade Térmica/Dolorosa: ( ) Preservada ( ) Ausente\n\n5. EXAME DERMATOLÓGICO E ESTRUTURAL\nIntegridade: ( ) Fissuras ( ) Maceração interdigital ( ) Micose cutânea/ungueal\nCalosidades: ( ) Pré-ulcerativas (com hemorragia subjacente?) ( ) Hiperqueratose\nDeformidades: ( ) Dedos em Garra/Martelo ( ) Charcot ( ) Hallux Valgus\nUnhas: ( ) Onicocriptose ( ) Onicogrifose ( ) Onicomicose\n\n6. CLASSIFICAÇÃO DE RISCO (IWGDF)\n( ) Grau 0: Sem neuropatia (Sensibilidade preservada).\n( ) Grau 1: Neuropatia presente (Perda da sensibilidade protetora).\n( ) Grau 2: Neuropatia + Deformidade ou Doença Arterial Periférica (DAP).\n( ) Grau 3: História de úlcera prévia ou amputação.\n\n7. CONDUTA E PLANEJAMENTO TERAPÊUTICO\n( ) Corte técnico de unhas / Desbridamento de calosidades\n( ) Fotobiomodulação (Laserterapia) para: ____________________________________\n( ) Encaminhamento para Angiologia / Endocrinologia\nRetorno em: ( ) 30 dias ( ) 90 dias ( ) 180 dias`
  },
  {
    id: 9,
    nome: 'FICHA DE ANAMNESE: SPA DOS PÉS & SAÚDE CLÍNICA',
    status: 'ATIVO',
    conteudo: `FICHA DE ANAMNESE: SPA DOS PÉS & SAÚDE CLÍNICA\n\n1. DADOS PESSOAIS\nNome Completo: __________________________________________________________________\nData de Nascimento: __/__/__ Idade: ________\nProfissão: _________________________ Telefone: ( ) ___________________________\n\n2. RASTREIO CLÍNICO E GRUPOS DE RISCO\n( ) Diabetes | Tipo: _______ Última HGT: ________\n( ) Gestante | Semanas: ______________\n( ) Hipertensão | ( ) Hipotensão\n( ) Neuropatias (Dormência, formigamento, queimação)\n( ) Alergias: ( ) Corantes ( ) Essências ( ) Cosméticos ( ) Aspirina/Ácido Salicílico\nTipo de calçado que utiliza hoje: ____________________________________________________\n\n3. AVALIAÇÃO VASCULAR PERIFÉRICA\nVarizes: ( ) Ausentes ( ) Pequenos Vasos ( ) Calibrosas/Salientes\nEdema (Inchaço): ( ) Ausente ( ) +/4+ ( ) ++/4+ ( ) +++/4+\nTemperatura dos Pés: ( ) Normal ( ) Frios (Isquemia?) ( ) Muito Quentes (Inflamação?)\nPerfusão (Enchimento Capilar): ( ) Normal (< 3 seg) ( ) Lentificado (> 3 seg)\nPulsos Pediosos: ( ) Presentes/Rítmicos ( ) Diminuídos ( ) Ausentes\nHistórico de TVP (Trombose Venosa Profunda): ( ) Sim ( ) Não\n\n4. AVALIAÇÃO ESTRUTURAL E NEUROLÓGICA (FOCO: PÉ DIABÉTICO)\nSensibilidade Térmica: ( ) Preservada ( ) Diminuída ( ) Ausente\nSensibilidade Tátil: ( ) Presente ( ) Ausente\nDeformidades: ( ) Dedos em garra/martelo ( ) Joanete ( ) Desabamento de arco\nIntegridade da Pele: ( ) Anidrose (Secura) ( ) Fissuras ( ) Micoses ( ) Úlceras\nSinais de Infecção: ( ) Vermelhidão ( ) Calor local ( ) Odor\nIntercorrências: Já teve feridas que demoraram a cicatrizar? ( ) Sim ( ) Não\n\n5. PROTOCOLO DE AROMATERAPIA & BEM-ESTAR\nSensibilidade Olfativa: ( ) Baixa ( ) Média ( ) Alta\nRestrições: ( ) Epilepsia ( ) Pressão Alta Descompensada\nObjetivo do Spa: ( ) Relaxamento ( ) Drenagem de Edema ( ) Energização\n\n6. TERMO DE RESPONSABILIDADE E CONSENTIMENTO\nDeclaro que as informações acima são verdadeiras. Estou ciente de que o Spa dos Pés é um procedimento de bem-estar. Como profissional graduanda em enfermagem e podóloga, informo que o protocolo será adaptado conforme as condições vasculares, neurológicas e sistêmicas identificadas para garantir minha segurança e integridade tecidual.\n\nData: __/__/__ Assinatura: ________________________________________________\nProfissional Responsável: Fabrícia Rodrigues | Podologia & Graduanda em Enfermagem`
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
    try {
      const saved = window.localStorage.getItem(this.key);
      if (!saved) return this.defaultData;
      let parsed = JSON.parse(saved);

      // Auto-migrate old default messages to new premium formatted versions
      if (this.key === 'configuracoes_gerais') {
        const oldDefaultLembrete = 'Olá @CLIENTE, passando para confirmar seu atendimento de @NOMESERVICO no dia @DIA às @HORA. Por favor, responda "SIM" para confirmar ou nos avise se precisar desmarcar. Atenciosamente, @NOMEEMPRESA.';
        const oldDefaultEmail = 'Olá @CLIENTE, seu agendamento de @NOMESERVICO na @NOMEEMPRESA foi confirmado com sucesso para o dia @DIA às @HORA. Solicitamos pontualidade de até 10 minutos. Agradecemos a preferência!';
        
        let changed = false;
        if (!parsed.mensagemLembrete || parsed.mensagemLembrete === oldDefaultLembrete) {
          parsed.mensagemLembrete = this.defaultData.mensagemLembrete;
          changed = true;
        }
        if (!parsed.mensagemEmail || parsed.mensagemEmail === oldDefaultEmail) {
          parsed.mensagemEmail = this.defaultData.mensagemEmail;
          changed = true;
        }
        if (changed) {
          this.save(parsed);
        }
      }

      return { ...this.defaultData, ...parsed }; // Merge to ensure new fields exist
    } catch (e) {
      return this.defaultData;
    }
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
  email: 'fabriciapodologa@gmail.com',
  telefone: '(19) 99722-2694',
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
  mensagemLembrete: `📌 Olá *@CLIENTE*!\n\nVocê tem um compromisso na *Clínica Fabrícia Rodrigues*:\n\nData: *@DIA* @DIASEMANA\nHora: *@HORA*.\nServiço: *@NOMESERVICO*.\n\nRua: Papa João Paulo ll, 256.\nBairro: Orlando Correia Barbosa.\nArtur Nogueira.\n\nDigite *CONFIRMAR* ou *CANCELAR*`,
  mensagemEmail: `🌿 Olá *@CLIENTE*!\n\nVocê tem um compromisso na *Clínica Fabrícia Rodrigues*:\n\n📆 Data: *@DIA*. @DIASEMANA \n🕓 Horário: *@HORA*.\n🦶🏼 Serviço: *@NOMESERVICO*.\n\n📍Rua: Papa João Paulo ll, 256.\nBairro: Orlando Correia Barbosa.\nArtur Nogueira.\n\n📌 Só lembrando de vir com (calçado confortável/sem esmalte, se for o caso).\n📌 Qualquer imprevisto, por favor me avise com antecedência.`,
  whatsappConectado: true
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
