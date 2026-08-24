import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { HardHat, CheckCircle2, ShieldCheck, Percent, FileText, Send, ArrowRight, UserCheck } from 'lucide-react';
import { API_URL } from '../config';

const CadastroProfissionalConvite = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    especialidade: 'Pedreiro',
    cidade: 'Cabreúva',
    experiencia: ''
  });

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [termsSettings, setTermsSettings] = useState({
    taxaComissaoProfissional: 15.00,
    termosProfissionalTexto: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const especialidades = [
    'Pedreiro',
    'Pintor',
    'Eletricista',
    'Encanador',
    'Gesseiro / Drywall',
    'Ajudante Geral',
    'Mestre de Obras',
    'Desentupidora',
    'Marido de Aluguel',
    'Jardineiro',
    'Ar Condicionado / Refrigeração'
  ];

  const cidades = ['Cabreúva', 'Jundiaí', 'Itupeva', 'Indaiatuba', 'ITU', 'São Paulo (Capital)', 'Outra Cidade em SP'];

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${API_URL}/professionals/terms-settings`);
        if (res.ok) {
          const data = await res.json();
          setTermsSettings(data);
        }
      } catch (err) {
        console.error('Erro ao carregar termos:', err);
      }
    };
    fetchTerms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!aceitouTermos) {
      setError('Você precisa ler e concordar com os termos de parceria e comissão para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/professionals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aceitouTermos: true,
          percentualDescontoAcordado: termsSettings.taxaComissaoProfissional
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Erro ao realizar o cadastro.');
      }
    } catch (err) {
      setError('Ocorreu uma falha de conexão. Tente novamente.');
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
        minHeight: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '750px',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px'
        }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                Solicitação Enviada com Sucesso!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 24px auto' }}>
                Obrigado por se credenciar como profissional parceiro da <strong>1001 OBRA</strong>.
                Seu cadastro e o aceite dos termos (comissão de {termsSettings.taxaComissaoProfissional}%) já foram registrados.
              </p>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '8px' }}>
                  <UserCheck size={20} /> Próximo Passo: Aprovação da Engenharia
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Nossa equipe de engenheiros validará seus dados. Assim que seu status for atualizado para <strong>Aprovado</strong> no painel, você passará a receber chamados de obras e serviços em sua região!
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Header do Convite */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '16px', color: '#000' }}>
                  <HardHat size={32} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 800, letterSpacing: '1px' }}>
                    Convite Oficial de Parceria
                  </span>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>Cadastro de Prestador Credenciado</h1>
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  padding: '14px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      required
                      className="form-control"
                      placeholder="Ex: João da Silva"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      name="telefone"
                      required
                      className="form-control"
                      placeholder="Ex: (11) 99999-8888"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">E-mail (Opcional)</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Especialidade Principal *</label>
                    <select
                      name="especialidade"
                      required
                      className="form-control"
                      value={formData.especialidade}
                      onChange={handleChange}
                    >
                      {especialidades.map((esp) => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cidade Principal de Atendimento *</label>
                  <select
                    name="cidade"
                    required
                    className="form-control"
                    value={formData.cidade}
                    onChange={handleChange}
                  >
                    {cidades.map((cidade) => (
                      <option key={cidade} value={cidade}>{cidade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Resumo da sua Experiência / Trabalhos</label>
                  <textarea
                    name="experiencia"
                    rows={3}
                    className="form-control"
                    placeholder="Conte resumidamente sobre seu tempo de profissão, principais obras realizadas, etc."
                    value={formData.experiencia}
                    onChange={handleChange}
                  />
                </div>

                {/* Caixa de Termos e Taxa de Desconto/Comissão */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <ShieldCheck color="var(--accent-color)" size={24} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                      Termos de Parceria e Comissão da Plataforma ({termsSettings.taxaComissaoProfissional}% Taxa)
                    </h3>
                  </div>

                  <div style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    maxHeight: '160px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-line',
                    marginBottom: '16px'
                  }}>
                    {termsSettings.termosProfissionalTexto || `Ao se cadastrar na plataforma 1001 OBRA como prestador parceiro, você concorda com os seguintes termos:

1. Intermediação de Serviços: A plataforma disponibiliza os chamados de clientes em sua região.
2. Retenção de Taxa da Plataforma: Sobre o valor total de cada serviço executado e aprovado pelo cliente, incide uma taxa de intermediação e garantia de ${termsSettings.taxaComissaoProfissional}% destinada à plataforma 1001 OBRA.
3. Repasse dos Valores: O profissional receberá ${100 - termsSettings.taxaComissaoProfissional}% do valor total do serviço de forma líquida conforme as etapas concluídas e validadas.
4. Compromisso de Qualidade: O prestador compromete-se a cumprir os prazos e manter padrão de qualidade e segurança nas obras.`}
                  </div>

                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}>
                    <input
                      type="checkbox"
                      checked={aceitouTermos}
                      onChange={(e) => setAceitouTermos(e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: 'var(--accent-color)' }}
                    />
                    <span>
                      Estou ciente e concordo com a taxa de <strong>{termsSettings.taxaComissaoProfissional}%</strong> de desconto/intermediação sobre os serviços prestados e aceito os Termos de Parceria.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    marginTop: '10px'
                  }}
                >
                  {loading ? 'Cadastrando...' : <>Enviar Cadastro para Aprovação <ArrowRight size={20} /></>}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default CadastroProfissionalConvite;
