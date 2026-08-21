import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { UserCheck, Send, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';

const TrabalheConosco = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [especialidade, setEspecialidade] = useState('Pintor');
  const [cidade, setCidade] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    setTelefone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !telefone || !cidade) return alert('Por favor, preencha todos os campos obrigatórios.');

    setLoading(true);

    const payload = {
      nome,
      telefone,
      email,
      especialidade,
      cidade,
      experiencia
    };

    try {
      const response = await fetch(`${API_URL}/professionals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o cadastro.');
      }

      setSubmitted(true);
      // Limpa formulário
      setNome('');
      setTelefone('');
      setEmail('');
      setEspecialidade('Pintor');
      setCidade('');
      setExperiencia('');
    } catch (err) {
      alert('Ocorreu um erro ao enviar seu cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        padding: '60px 24px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '600px',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '40px'
        }}>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '40px 0' }}>
              <div style={{ background: 'var(--success)', color: '#fff', padding: '16px', borderRadius: '50%' }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cadastro Recebido!</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Obrigado pelo seu interesse em fazer parceria com a **1001 Obra**. O cadastro do seu perfil foi salvo no nosso banco de dados. Nossa equipe de engenharia revisará suas informações e entrará em contato via WhatsApp para marcar uma entrevista.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '12px' }}>
                Enviar Novo Cadastro
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px', color: '#000' }}>
                  <UserCheck size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Trabalhe Conosco</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Faça parte da nossa rede de profissionais credenciados da 1001 Obra</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite seu nome completo"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">WhatsApp (Celular) *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="(11) 99999-9999"
                      required
                      value={telefone}
                      onChange={handlePhoneChange}
                      maxLength={15}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-mail (Opcional)</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Sua Especialidade *</label>
                    <select 
                      className="form-control"
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                    >
                      <option value="Pintor">Pintor de Parede</option>
                      <option value="Pedreiro">Pedreiro / Alvenaria</option>
                      <option value="Eletricista">Eletricista Residencial/Industrial</option>
                      <option value="Encanador">Encanador / Hidráulica</option>
                      <option value="Gesseiro">Gesseiro / Drywall</option>
                      <option value="Ajudante Geral">Ajudante Geral</option>
                      <option value="Mestre de Obras">Mestre de Obras</option>
                      <option value="Serralheiro / Carpinteiro">Serralheiro / Carpinteiro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade de Atuação *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Cabreúva"
                      required
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Conte um pouco sobre sua experiência profissional</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Quais obras já fez, tempo de experiência na área, se possui ferramentas próprias, etc."
                    rows={4}
                    value={experiencia}
                    onChange={(e) => setExperiencia(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <Send size={18} />
                  <span>{loading ? 'Cadastrando...' : 'Enviar Cadastro Profissional'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrabalheConosco;
