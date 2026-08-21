import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { HardHat, MapPin, Zap, CheckCircle2, Phone, RefreshCw, Calendar, XCircle, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

const PainelProfissional = () => {
  const [selectedCity, setSelectedCity] = useState('Cabreúva');
  const [activeProf, setActiveProf] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  
  // Estados para Justificativa de cancelamento e Adicionais
  const [justificativa, setJustificativa] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAdditionDialog, setShowAdditionDialog] = useState(false);
  const [extraDesc, setExtraDesc] = useState('');
  const [extraPreco, setExtraPreco] = useState('');

  const mockProfessionals = [
    { id: 'prof-1', nome: 'Claudio Rogerio da Silva', especialidade: 'Pintor', cidade: 'Cabreúva', status: 'Aprovado' },
    { id: 'prof-2', nome: 'Marcio Souza Neto', especialidade: 'Pedreiro', cidade: 'Cabreúva', status: 'Aprovado' },
    { id: 'prof-3', nome: 'Junior Barbosa', especialidade: 'Eletricista', cidade: 'Jundiaí', status: 'Aprovado' },
    { id: 'prof-4', nome: 'Roberto Alves', especialidade: 'Encanador', cidade: 'Cabreúva', status: 'Pendente' }
  ];

  const fetchPendingRequests = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/requests/pending?cidade=${city}`);
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeProf && activeProf.status === 'Aprovado') {
      fetchPendingRequests(activeProf.cidade);
    }
  }, [activeProf]);

  const handleAcceptJob = async (job) => {
    if (!activeProf) return;
    try {
      const response = await fetch(`${API_URL}/requests/${job.id}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profissionalId: activeProf.id })
      });

      if (response.ok) {
        setActiveJob(job);
        fetchPendingRequests(activeProf.cidade);
      } else {
        alert('Este chamado já foi aceito por outro profissional.');
      }
    } catch (err) {
      alert('Erro ao aceitar o serviço.');
    }
  };

  const handleDeclineJob = (jobId) => {
    setDeclinedRequests([...declinedRequests, jobId]);
  };

  const handleCancelWithJustification = async () => {
    if (!justificativa) return alert('Por favor, informe a justificativa de cancelamento.');
    try {
      const response = await fetch(`${API_URL}/requests/${activeJob.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelado', justificativaCancelamento: justificativa })
      });
      if (response.ok) {
        alert('Serviço cancelado. A justificativa foi registrada.');
        setActiveJob(null);
        setShowCancelDialog(false);
        setJustificativa('');
        fetchPendingRequests(activeProf.cidade);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProposeAddition = async () => {
    if (!extraDesc || !extraPreco) return alert('Por favor, preencha todos os campos.');
    try {
      const response = await fetch(`${API_URL}/requests/${activeJob.id}/propose-addition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precoAdicional: extraPreco, justificativaAdicional: extraDesc })
      });
      if (response.ok) {
        alert('Serviço adicional proposto com sucesso! Aguardando o aceite do cliente.');
        const updated = await response.json();
        setActiveJob(updated.request);
        setShowAdditionDialog(false);
        setExtraDesc('');
        setExtraPreco('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishJob = async (status) => {
    if (!activeJob) return;
    try {
      const response = await fetch(`${API_URL}/requests/${activeJob.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }) // 'Finalizado' or 'Cancelado'
      });

      if (response.ok) {
        alert(status === 'Finalizado' ? 'Serviço concluído com sucesso!' : 'Serviço cancelado.');
        setActiveJob(null);
        fetchPendingRequests(activeProf.cidade);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatMaskedName = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map((p, idx) => {
      if (idx === 0) return p;
      return p.charAt(0) + '***';
    }).join(' ');
  };

  const visibleRequests = pendingRequests.filter(job => !declinedRequests.includes(job.id));

  return (
    <>
      <Header />
      <div style={{
        background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        padding: '60px 24px',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '800px',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px'
        }}>

          {!activeProf ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px', color: '#000' }}>
                  <HardHat size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Painel do Profissional</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Faça login para receber chamados em tempo real na sua região</p>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Selecione seu perfil para simular</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockProfessionals.map((prof) => (
                  <div 
                    key={prof.id} 
                    className="glass-card" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      padding: '16px 20px'
                    }}
                    onClick={() => setActiveProf(prof)}
                  >
                    <div>
                      <h4 style={{ fontWeight: 800 }}>{prof.nome}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {prof.especialidade} | {prof.cidade}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontWeight: 700,
                      background: prof.status === 'Aprovado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: prof.status === 'Aprovado' ? '#10b981' : 'var(--accent-color)'
                    }}>{prof.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Header do Profissional Conectado */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 800 }}>Profissional Online</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0' }}>{activeProf.nome}</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Especialidade: <strong>{activeProf.especialidade}</strong> | Cidade: <strong>{activeProf.cidade}</strong>
                  </p>
                </div>
                <button onClick={() => { setActiveProf(null); setActiveJob(null); }} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Desconectar
                </button>
              </div>

              {/* Status Pendente de Aprovação */}
              {activeProf.status !== 'Aprovado' ? (
                <div className="glass-card" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent-color)', textAlign: 'center', padding: '30px' }}>
                  <h3 style={{ color: 'var(--accent-color)', fontWeight: 800, marginBottom: '8px' }}>Cadastro em Análise</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Seu perfil ainda não foi aprovado pelos engenheiros da 1001 Obra. Vá até o **Painel Administrativo** para aprovar o seu perfil antes de receber chamados.
                  </p>
                </div>
              ) : activeJob ? (
                /* Serviço em Andamento */
                <div className="glass-card animate-fade-in" style={{ border: '1px solid var(--accent-color)', background: 'var(--accent-glow)', padding: '24px' }}>
                  <span style={{ background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Serviço em Andamento</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 8px 0' }}>{activeJob.servicoSelecionado}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem', margin: '16px 0' }}>
                    <div><strong>Cliente:</strong> {activeJob.clienteNome}</div>
                    <div><strong>Endereço:</strong> {activeJob.bairro}, {activeJob.cidade}</div>
                    <div><strong>Tipo de Cobrança:</strong> {activeJob.tipoPreco} {activeJob.tipoPreco === 'Preço Fechado' ? `(${activeJob.metragem} m²)` : `(${activeJob.quantidadeDias} diárias/dias)`}</div>
                    <div><strong>Preço Bruto:</strong> R$ {parseFloat(activeJob.precoEstimado).toFixed(2)}</div>
                    <div><strong>Sua Comissão (85%):</strong> R$ {(parseFloat(activeJob.precoEstimado) - parseFloat(activeJob.taxaIntermediacao)).toFixed(2)}</div>
                    <div><strong>Taxa da Plataforma (15%):</strong> R$ {parseFloat(activeJob.taxaIntermediacao).toFixed(2)}</div>
                    {activeJob.fotosVideos && (() => {
                      let media = [];
                      try { media = JSON.parse(activeJob.fotosVideos) || []; } catch(e) {}
                      if (media.length === 0) return null;
                      return (
                        <div style={{ marginTop: '8px' }}>
                          <strong>Fotos da Obra:</strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            {media.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt="Obra" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Detalhes do serviço adicional proposto */}
                  {activeJob.aprovadoAdicional && activeJob.aprovadoAdicional !== 'Nenhum' && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      borderLeft: '4px solid var(--accent-color)',
                      padding: '16px',
                      borderRadius: '8px',
                      margin: '16px 0',
                      fontSize: '0.9rem'
                    }}>
                      <h4 style={{ fontWeight: 800, margin: '0 0 6px 0' }}>Serviço Adicional Proposto</h4>
                      <div><strong>Descrição:</strong> {activeJob.justificativaAdicional}</div>
                      <div><strong>Valor Extra:</strong> R$ {parseFloat(activeJob.precoAdicional).toFixed(2)}</div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>Status de Aprovação:</strong>{' '}
                        <span style={{
                          fontWeight: 700,
                          color: activeJob.aprovadoAdicional === 'Aprovado' ? '#10b981' : activeJob.aprovadoAdicional === 'Recusado' ? '#ef4444' : 'var(--accent-color)'
                        }}>
                          {activeJob.aprovadoAdicional === 'Pendente' ? 'Aguardando cliente aprovar...' : activeJob.aprovadoAdicional === 'Aprovado' ? 'Aprovado pelo cliente!' : 'Recusado pelo cliente.'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <a href={`https://wa.me/55${activeJob.clienteTelefone}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={16} /> Entrar em Contato
                    </a>
                    
                    {activeJob.aprovadoAdicional !== 'Pendente' && (
                      <button 
                        onClick={() => setShowAdditionDialog(true)} 
                        className="btn-primary" 
                        style={{ background: 'var(--accent-gradient)', color: '#000', border: 'none' }}
                      >
                        + Propor Adicional
                      </button>
                    )}

                    <button onClick={() => handleFinishJob('Finalizado')} className="btn-primary" style={{ background: '#10b981', color: '#fff', border: 'none' }}>
                      Finalizar Serviço
                    </button>
                    
                    <button onClick={() => setShowCancelDialog(true)} className="btn-secondary" style={{ color: 'var(--danger)' }}>
                      Cancelar Serviço
                    </button>
                  </div>

                  {/* Modal de Cancelamento com Justificativa */}
                  {showCancelDialog && (
                    <div style={{
                      marginTop: '20px',
                      background: 'var(--bg-secondary)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <h4 style={{ fontWeight: 800, color: 'var(--danger)', margin: 0 }}>Justificativa do Cancelamento</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Por favor, informe ao cliente e à engenharia o motivo do cancelamento:</p>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Ex: Cliente não estava no local / Tubulação não suporta o serviço..."
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowCancelDialog(false)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Voltar</button>
                        <button onClick={handleCancelWithJustification} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'var(--danger)', color: '#fff', border: 'none' }}>Confirmar Cancelamento</button>
                      </div>
                    </div>
                  )}

                  {/* Modal para Propor Serviço Adicional */}
                  {showAdditionDialog && (
                    <div style={{
                      marginTop: '20px',
                      background: 'var(--bg-secondary)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <h4 style={{ fontWeight: 800, margin: 0 }}>Propor Serviço Adicional</h4>
                      <div className="form-group">
                        <label className="form-label">Descrição do Adicional</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ex: Troca de válvula extra de 1/2 polegada"
                          value={extraDesc}
                          onChange={(e) => setExtraDesc(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Preço Adicional (R$)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Ex: 85.00"
                          value={extraPreco}
                          onChange={(e) => setExtraPreco(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowAdditionDialog(false)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Cancelar</button>
                        <button onClick={handleProposeAddition} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Enviar Proposta</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Lista de chamados pendentes */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Chamados em {activeProf.cidade}</h3>
                    <button onClick={() => fetchPendingRequests(activeProf.cidade)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <RefreshCw size={14} /> Atualizar
                    </button>
                  </div>

                  {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Carregando chamados...</p>
                  ) : visibleRequests.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Nenhum chamado em aberto para sua cidade neste momento.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {visibleRequests.map((job) => (
                        <div 
                          key={job.id} 
                          className="glass-card animate-fade-in" 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '16px', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '16px', 
                            padding: '24px' 
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.15rem' }}>{job.servicoSelecionado}</h4>
                                {parseFloat(job.multiplicadorDinamico) > 1.00 && (
                                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <Zap size={10} /> Tarifa {job.multiplicadorDinamico}x
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} color="var(--accent-color)" /> {job.bairro}, {job.cidade}
                              </span>
                            </div>

                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                              R$ {(parseFloat(job.precoEstimado) - parseFloat(job.taxaIntermediacao)).toFixed(2)}
                              <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500 }}>Sua Comissão (85%)</span>
                            </span>
                          </div>

                          {/* Expandable Details Area */}
                          <div style={{ 
                            background: 'var(--bg-tertiary)', 
                            padding: '16px', 
                            borderRadius: '10px', 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            <div><strong>Cliente:</strong> {formatMaskedName(job.clienteNome)}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={14} />
                              <span><strong>Solicitado em:</strong> {new Date(job.createdAt).toLocaleString('pt-BR')}</span>
                            </div>
                            <div><strong>Tipo de Cobrança:</strong> {job.tipoPreco} {job.tipoPreco === 'Preço Fechado' ? `(${job.metragem} m²)` : `(${job.quantidadeDias} diárias/dias)`}</div>
                            <div><strong>Distância estimada:</strong> Menos de 5 km da sua localidade</div>
                            <div><strong>Taxa da Plataforma:</strong> R$ {parseFloat(job.taxaIntermediacao).toFixed(2)} (15% retida)</div>
                            
                            {/* Renderizar Fotos anexadas se existirem */}
                            {job.fotosVideos && (() => {
                              let media = [];
                              try { media = JSON.parse(job.fotosVideos) || []; } catch(e) {}
                              if (media.length === 0) return null;
                              return (
                                <div style={{ marginTop: '8px' }}>
                                  <strong>Fotos da Área do Serviço:</strong>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    {media.map((url, idx) => (
                                      <a key={idx} href={url} target="_blank" rel="noreferrer">
                                        <img src={url} alt="Obra" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleDeclineJob(job.id)} 
                              className="btn-secondary" 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                color: 'var(--danger)', 
                                border: '1px solid var(--border-color)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <XCircle size={16} /> Recusar
                            </button>
                            <button 
                              onClick={() => handleAcceptJob(job)} 
                              className="btn-primary"
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                background: '#10b981', 
                                color: '#fff', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle size={16} /> Aceitar Serviço
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PainelProfissional;
