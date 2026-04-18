import { useState } from 'react';
import { HelpCircle, RefreshCcw, Plus } from 'lucide-react';

export default function AgendarTab({ onSave, currentDate, preSelectedTime }) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    birthdate: '',
    service: 'Avaliação',
    date: currentDate ? currentDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: preSelectedTime || '10:00',
    duration: '01:00',
    repeat: 'Nunca',
    status: 'Agendado',
    notifySms: 'SIM',
    notes: '',
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.clientName) return alert("Por favor, preencha o cliente.");
    
    let sHour = parseInt(formData.startTime.split(':')[0]) || 9;
    let sMin = parseInt(formData.startTime.split(':')[1]) || 0;
    let dHour = parseInt(formData.duration.split(':')[0]) || 1;
    let dMin = parseInt(formData.duration.split(':')[1]) || 0;
    
    let totalMins = sMin + dMin;
    let finalHour = sHour + dHour + Math.floor(totalMins / 60);
    let finalMins = totalMins % 60;
    
    const endTime = `${finalHour.toString().padStart(2, '0')}:${finalMins.toString().padStart(2, '0')}`;
    
    onSave({ ...formData, endTime });
  };

  return (
    <div style={{maxWidth: '800px'}}>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <CalendarIcon /> <h2 style={{fontWeight: 400, color: '#555', fontSize: '1.3rem'}}>Agendar <HelpCircle size={16} color="#aaa"/></h2>
        <div style={{marginLeft: 'auto', display: 'flex', gap: '0.5rem'}}>
           <button className="btn btn-primary"><RefreshCcw size={16}/></button>
           <button className="btn btn-primary"><Plus size={16}/></button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{border: '1px solid var(--sa-border)', padding: '1.5rem', background: '#fff', borderRadius: '4px'}}>
        
        <div className="grid-cols-2">
          <div className="input-group form-group" style={{gridColumn: '1 / -1'}}>
             <input type="text" name="clientName" className="form-control" placeholder="Cliente..." value={formData.clientName} onChange={handleChange} required />
             <div className="input-group-addon" style={{borderLeft: 'none'}}><UserIcon/></div>
             <button type="button" className="btn btn-success" style={{borderRadius: '0 4px 4px 0'}}><SearchIcon/></button>
          </div>
        </div>

        <div className="grid-cols-2">
          <div className="input-group form-group">
            <div className="input-group-addon">( _ ) ___ - ____</div>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="date" name="birthdate" className="form-control" placeholder="Nascimento" value={formData.birthdate} onChange={handleChange} title="Nascimento"/>
          </div>
        </div>

        <div className="input-group form-group">
          <select name="service" className="form-control" value={formData.service} onChange={handleChange}>
            <option>Avaliação</option>
            <option>Podoprofilaxia Completa</option>
          </select>
          <button type="button" className="btn btn-primary" style={{borderRadius: 0}}><Plus size={16}/></button>
          <button type="button" className="btn btn-success" style={{borderRadius: '0 4px 4px 0'}}><SearchIcon/></button>
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
             <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} />
          </div>
          <div className="grid-cols-2" style={{gap: '0.5rem'}}>
             <input type="time" name="startTime" className="form-control" value={formData.startTime} onChange={handleChange} />
             <input type="time" name="duration" className="form-control" value={formData.duration} onChange={handleChange} title="Duração"/>
          </div>
        </div>

        <div className="form-group">
           <select className="form-control" disabled><option>Fabricia Rodrigues Pereira</option></select>
        </div>

        <div className="form-group">
           <textarea name="notes" className="form-control" rows="2" placeholder="Observação..." value={formData.notes} onChange={handleChange}></textarea>
        </div>

        <div className="grid-cols-2">
           <div className="input-group form-group">
              <div className="input-group-addon">Repetir?</div>
              <select name="repeat" className="form-control" value={formData.repeat} onChange={handleChange}>
                <option>Nunca</option>
              </select>
           </div>
           <div className="form-group">
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option>Agendado</option>
                <option>Confirmado</option>
              </select>
           </div>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
           <span style={{marginRight: '1rem'}}>Enviar SMS</span>
           <div style={{display: 'flex', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', marginRight: '1rem'}}>
              <button type="button" style={{padding: '0.5rem 1rem', border: 'none', background: formData.notifySms==='SIM'?'#e6e6e6':'white'}} onClick={()=>setFormData({...formData, notifySms:'SIM'})}>SIM</button>
              <button type="button" style={{padding: '0.5rem 1rem', border: 'none', background: formData.notifySms==='NÃO'?'#d9534f':'white', color: formData.notifySms==='NÃO'?'white':'#333'}} onClick={()=>setFormData({...formData, notifySms:'NÃO'})}>NÃO</button>
           </div>
           <button type="submit" className="btn btn-success" style={{padding: '0.6rem 1.5rem'}}><b style={{fontWeight: 700}}>✓ SALVAR</b></button>
        </div>

      </form>
    </div>
  );
}

const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
