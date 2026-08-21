import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ShieldAlert, Zap, Compass, CheckCircle2, User, Phone, Search, Loader, Image, Video, Paperclip, XCircle } from 'lucide-react';
import { API_URL } from '../config';

const LISTA_SERVICOS = [
  "Pedreiro - Levantamento de Muros",
  "Pedreiro - Assentamento de Pisos e Porcelanatos",
  "Pedreiro - Acabamento Fino",
  "Pedreiro - Reformas em Geral",
  "Pintor - Pintura Residencial Interna/Externa",
  "Pintor - Massa Corrida e Nivelamento",
  "Pintor - Pintura de Fachadas e Alturas",
  "Eletricista - Troca de Fiação e Curto-Circuito",
  "Eletricista - Instalação de Tomadas e Disjuntores",
  "Eletricista - Wallbox e Carregador de Veículo",
  "Encanador - Conserto de Vazamentos",
  "Encanador - Limpeza de Caixa D'água",
  "Encanador - Tubulações de Gás e Fogão",
  "Gesseiro - Sancas Decorativas e Drywall",
  "Gesseiro - Rebaixamento de Forro de Gesso",
  "Marido de Aluguel - Pequenos Reparos",
  "Desentupidora - Desentupimento Geral",
  "Jardineiro - Conservação de Áreas Verdes",
  "Instalação e Manutenção de Ar Condicionado"
];

const SolicitarServico = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('Cabreúva');
  const [bairro, setBairro] = useState('Centro');
  const [servico, setServico] = useState(LISTA_SERVICOS[0]);
  
  // Novos campos: metragem, diária e fotos/vídeos
  const [tipoPreco, setTipoPreco] = useState('Preço Fechado'); // 'Preço Fechado' | 'Diária'
  const [metragem, setMetragem] = useState('30');
  const [quantidadeDias, setQuantidadeDias] = useState('3');
  const [mídiaUrls, setMídiaUrls] = useState([]);
  
  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // 'Buscando', 'Aceito'
  const [acceptedProf, setAcceptedProf] = useState(null);

  const handlePhoneFormat = (val) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleAddMockMedia = () => {
    setMídiaUrls([
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=400'
    ]);
  };

  const [activeRequestDetails, setActiveRequestDetails] = useState(null);

  // Polling em tempo real do status do chamado
  useEffect(() => {
    let interval;
    if (requestId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_URL}/requests/${requestId}`);
          if (response.ok) {
            const data = await response.json();
            setRequestStatus(data.request.status);
            setActiveRequestDetails(data.request);
            if (data.profissional) {
              setAcceptedProf(data.profissional);
            }
          }
        } catch (err) {
          console.error('Erro ao consultar status do chamado:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [requestId]);

  const handleRespondAddition = async (aprovado) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}/respond-addition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aprovado })
      });
      if (response.ok) {
        alert(aprovado ? 'Acréscimo de serviço aprovado!' : 'Acréscimo recusado.');
        const data = await response.json();
        setActiveRequestDetails(data.request);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const simulateAcceptance = async () => {
    // Para simular, aceitamos a proposta utilizando um profissional mock no banco
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profissionalId: 'prof-1' }) // Vincula o Pintor do mock
      });
      if (response.ok) {
        alert('Simulação: Chamado aceito pelo profissional Claudio!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetEstimate = async (e) => {
    e.preventDefault();
    if (!nome || !telefone || !cidade || !bairro) return alert('Por favor, preencha todos os dados obrigatórios.');

    setLoadingEstimate(true);
    setEstimate(null);

    try {
      const response = await fetch(`${API_URL}/requests/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicoSelecionado: servico,
          cidade,
          bairro,
          tipoPreco,
          metragem: tipoPreco === 'Preço Fechado' ? parseFloat(metragem) : null,
          quantidadeDias: tipoPreco === 'Diária' ? parseInt(quantidadeDias) : null
        })
      });

      if (!response.ok) throw new Error('Falha ao calcular tarifa.');
      const data = await response.json();
      setEstimate(data);
    } catch (err) {
      alert('Erro ao calcular tarifa dinâmica. Tente novamente.');
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleConfirmRequest = async () => {
    if (!estimate) return;

    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNome: nome,
          clienteTelefone: telefone,
          servicoSelecionado: servico,
          cidade,
          bairro,
          precoEstimado: estimate.precoEstimado,
          taxaIntermediacao: estimate.taxaIntermediacao,
          multiplicadorDinamico: estimate.multiplicador,
          metragem: tipoPreco === 'Preço Fechado' ? parseFloat(metragem) : null,
          tipoPreco,
          quantidadeDias: tipoPreco === 'Diária' ? parseInt(quantidadeDias) : null,
          fotosVideos: mídiaUrls
        })
      });

      if (!response.ok) throw new Error('Erro ao solicitar serviço.');
      const data = await response.json();
      setRequestId(data.request.id);
      setRequestStatus('Buscando');
    } catch (err) {
      alert('Falha ao enviar chamado. Tente novamente.');
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
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '700px',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px'
        }}>

          {requestStatus === 'Buscando' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '30px 0' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader size={48} className="animate-spin" color="var(--accent-color)" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Procurando Profissional...</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', lineHeight: 1.6 }}>
                Enviamos seu chamado detalhado de **{servico}** para os profissionais aprovados em **{cidade} - {bairro}**. 
              </p>
              <div className="glass-card" style={{ width: '100%', padding: '16px', background: 'var(--accent-glow)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-color)' }}>
                  Demanda Local: {estimate?.solicitacoesAtivas} solicitações | Tarifa: {estimate?.multiplicador}x
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={simulateAcceptance} className="btn-primary">
                  Simular Aceitação do Profissional
                </button>
                <button type="button" onClick={() => setRequestStatus(null)} className="btn-secondary" style={{ color: 'var(--danger)' }}>
                  Cancelar Chamado
                </button>
              </div>
            </div>
          )}

          {requestStatus === 'Cancelado' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '30px 0' }}>
              <div style={{ background: 'var(--danger)', color: '#fff', padding: '16px', borderRadius: '50%' }}>
                <XCircle size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Chamado Cancelado</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', lineHeight: 1.6 }}>
                Seu chamado foi cancelado pelo profissional ou pela plataforma.
              </p>
              {activeRequestDetails?.justificativaCancelamento && (
                <div className="glass-card" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                  <strong>Motivo do Cancelamento:</strong>
                  <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    "{activeRequestDetails.justificativaCancelamento}"
                  </p>
                </div>
              )}
              <button type="button" onClick={() => { setRequestStatus(null); setEstimate(null); }} className="btn-secondary" style={{ marginTop: '12px' }}>
                Fazer Nova Solicitação
              </button>
            </div>
          )}

          {requestStatus === 'Finalizado' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '30px 0' }}>
              <div style={{ background: '#10b981', color: '#fff', padding: '16px', borderRadius: '50%' }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Serviço Concluído!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', lineHeight: 1.6 }}>
                O profissional parceiro finalizou a execução do serviço com sucesso. Agradecemos a preferência!
              </p>
              <div className="glass-card" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div><strong>Valor Total Pago:</strong> R$ {parseFloat(activeRequestDetails?.precoEstimado).toFixed(2)}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Intermediação e garantia 1001 Obra inclusas.</div>
              </div>
              <button type="button" onClick={() => { setRequestStatus(null); setEstimate(null); }} className="btn-primary" style={{ marginTop: '12px' }}>
                Solicitar Outro Serviço
              </button>
            </div>
          )}

          {(requestStatus === 'Aceito' || requestStatus === 'Em Caminho') && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '30px 0' }}>
              <div style={{ background: '#10b981', color: '#fff', padding: '16px', borderRadius: '50%' }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profissional Confirmado!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', lineHeight: 1.6 }}>
                Seu chamado foi aceito. O profissional parceiro está a caminho do local de atendimento.
              </p>

              {/* Alerta de Serviço Adicional Proposto */}
              {activeRequestDetails?.aprovadoAdicional === 'Pendente' && (
                <div className="glass-card animate-fade-in" style={{
                  width: '100%',
                  border: '1px solid var(--accent-color)',
                  background: 'var(--accent-glow)',
                  textAlign: 'left',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h4 style={{ fontWeight: 800, margin: 0, color: 'var(--accent-color)' }}>Acréscimo Proposto pelo Profissional</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    O prestador identificou a necessidade de um serviço extra:
                  </p>
                  <div style={{ fontSize: '0.9rem', background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                    <div><strong>Serviço Extra:</strong> {activeRequestDetails.justificativaAdicional}</div>
                    <div style={{ marginTop: '4px' }}><strong>Valor Adicional:</strong> R$ {parseFloat(activeRequestDetails.precoAdicional).toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => handleRespondAddition(false)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Recusar</button>
                    <button type="button" onClick={() => handleRespondAddition(true)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none' }}>Aprovar e Pagar</button>
                  </div>
                </div>
              )}

              <div className="glass-card" style={{ width: '100%', textAlign: 'left', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ficha do Prestador</h4>
                <div><strong>Nome:</strong> {acceptedProf?.nome}</div>
                <div><strong>Especialidade:</strong> {acceptedProf?.especialidade}</div>
                <div><strong>Valor Atualizado:</strong> R$ {parseFloat(activeRequestDetails?.precoEstimado || 0).toFixed(2)}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <a 
                  href={`https://wa.me/55${acceptedProf?.telefone}?text=Olá%20${acceptedProf?.nome},%20meu%20chamado%20de%20${servico}%20no%20sistema%20da%201001%20Obra%20foi%20aceito!`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Falar no WhatsApp
                </a>
                <button type="button" onClick={() => { setRequestStatus(null); setEstimate(null); }} className="btn-secondary">
                  Voltar à Home
                </button>
              </div>
            </div>
          )}

          {!requestStatus && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px', color: '#000' }}>
                  <Compass size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Chamar Profissional</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Conectamos você ao melhor especialista da sua região sob demanda</p>
                </div>
              </div>

              <form onSubmit={handleGetEstimate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Qual serviço você precisa hoje?</label>
                  <select 
                    className="form-control"
                    value={servico}
                    onChange={(e) => setServico(e.target.value)}
                  >
                    {LISTA_SERVICOS.map((item, idx) => (
                      <option key={idx} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Como deseja pagar?</label>
                    <select 
                      className="form-control"
                      value={tipoPreco}
                      onChange={(e) => setTipoPreco(e.target.value)}
                    >
                      <option value="Preço Fechado">Preço Fechado (por m²)</option>
                      <option value="Diária">Por Diária (Dias)</option>
                    </select>
                  </div>

                  {tipoPreco === 'Preço Fechado' ? (
                    <div className="form-group">
                      <label className="form-label">Metragem Estimada (m²)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        min="1"
                        value={metragem}
                        onChange={(e) => setMetragem(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Quantidade de Dias</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        min="1"
                        value={quantidadeDias}
                        onChange={(e) => setQuantidadeDias(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Seção de Fotos e Vídeos */}
                <div className="form-group">
                  <label className="form-label">Fotos / Vídeos da Área de Serviço</label>
                  <div style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    background: 'var(--bg-tertiary)'
                  }}>
                    {mídiaUrls.length === 0 ? (
                      <div>
                        <Paperclip size={24} style={{ color: 'var(--text-secondary)', marginBottom: '8px' }} />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                          Arraste arquivos ou anexe imagens da parede, vazamento ou fiação.
                        </p>
                        <button 
                          type="button" 
                          onClick={handleAddMockMedia} 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Anexar Fotos de Exemplo
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {mídiaUrls.map((url, idx) => (
                            <img 
                              key={idx} 
                              src={url} 
                              alt="Anexo" 
                              style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>2 Imagens anexadas com sucesso!</span>
                        <button 
                          type="button" 
                          onClick={() => setMídiaUrls([])} 
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--danger)' }}
                        >
                          Remover Anexos
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Cidade *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bairro *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Seu Nome *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Seu nome"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp (Celular) *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="(11) 99999-9999"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(handlePhoneFormat(e.target.value))}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loadingEstimate}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', borderRadius: '12px' }}
                >
                  {loadingEstimate ? 'Verificando Demanda Local...' : 'Calcular Tarifa Dinâmica'}
                </button>
              </form>

              {estimate && (
                <div className="glass-card animate-fade-in" style={{
                  marginTop: '28px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Resumo do Chamado</h3>
                    {estimate.multiplicador > 1.00 && (
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: 'var(--accent-color)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Zap size={14} /> Tarifa Dinâmica ({estimate.multiplicador}x)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.925rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Tipo de Precificação:</span>
                      <strong>{tipoPreco} {tipoPreco === 'Preço Fechado' ? `(${metragem} m²)` : `(${quantidadeDias} dias)`}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Preço Estimado Final:</span>
                      <strong>R$ {estimate.precoEstimado.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Taxa de Intermediação (15% inclusa):</span>
                      <span>R$ {estimate.taxaIntermediacao.toFixed(2)}</span>
                    </div>
                    {mídiaUrls.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Fotos da Obra Anexadas:</span>
                        <strong style={{ color: '#10b981' }}>{mídiaUrls.length} anexos</strong>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleConfirmRequest} 
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', padding: '12px', background: 'var(--accent-gradient)', color: '#000', border: 'none' }}
                  >
                    Confirmar e Chamar Profissional
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default SolicitarServico;
