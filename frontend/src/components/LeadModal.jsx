import React, { useState, useEffect } from 'react';
import { X, Send, PhoneCall } from 'lucide-react';
import { API_URL } from '../config';

const LeadModal = ({ isOpen, onClose, leadData }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    if (!nome || !telefone) return alert('Por favor preencha nome e telefone.');

    setLoading(true);

    const payload = {
      nome,
      telefone,
      assunto: leadData?.assunto || 'Contato Geral',
      descricao: descricao || leadData?.descricao || '',
      calculadoraDados: leadData?.calculadoraDados || null,
      origemUrl: window.location.href
    };

    try {
      // Grava no backend
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar lead no backend.');
      }

      // Sucesso: Redireciona para o WhatsApp
      const whatsUrl = leadData?.whatsappLink || `https://api.whatsapp.com/send?phone=5511965111670&text=${encodeURIComponent(`Olá, sou ${nome}. Gostaria de solicitar um orçamento para ${payload.assunto}.`)}`;
      window.open(whatsUrl, '_blank');
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback: mesmo com erro no banco, redireciona o cliente para o WhatsApp comercial para não perder a venda!
      const whatsUrl = leadData?.whatsappLink || `https://api.whatsapp.com/send?phone=5511965111670&text=${encodeURIComponent(`Olá, sou ${nome}. Gostaria de solicitar um orçamento para ${payload.assunto}.`)}`;
      window.open(whatsUrl, '_blank');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <PhoneCall size={24} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Fale com nossos Engenheiros</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
          Confirme seus dados de contato para gerar o orçamento oficial e iniciar seu atendimento direto pelo WhatsApp.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Seu Nome completo</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Digite seu nome"
              required 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone (WhatsApp)</label>
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
            <label className="form-label">Detalhes da obra (Opcional)</label>
            <textarea 
              className="form-control" 
              placeholder="Descreva detalhes como urgência, altura do pé direito, etc."
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', borderRadius: '12px' }}
          >
            <Send size={18} />
            <span>{loading ? 'Processando...' : 'Iniciar Atendimento'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
