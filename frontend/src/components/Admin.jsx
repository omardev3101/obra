import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Lock, FileText, Users, Settings, Plus, Trash2, CheckCircle2, Circle, DollarSign } from 'lucide-react';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [leads, setLeads] = useState([]);
  const [seoPages, setSeoPages] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('leads');
  
  // SEO Form State
  const [newSEO, setNewSEO] = useState({
    servico: '',
    cidade: '',
    bairro: 'Centro',
    tituloSEO: '',
    descricaoSEO: '',
    conteudoH1: '',
    textoPersonalizado: '',
    imagemAntes: '',
    imagemDepois: ''
  });

  // Portfolio Project State
  const [newProject, setNewProject] = useState({
    titulo: '',
    categoria: 'Residencial',
    localizacao: '',
    metragem: '',
    tempoExecucao: '',
    imagemAntes: '',
    imagemDepois: '',
    escopo: ''
  });

  const [companySettings, setCompanySettings] = useState({
    nomeEmpresa: '1001 OBRA',
    logoUrl: '/logo.png',
    telefone: '(11) 96511-1670',
    whatsapp: '5511965111670',
    email: 'contato@1001obra.com.br',
    horarioFuncionamento: 'Seg a Sáb: 08:00 às 18:00',
    endereco: 'Atendimento em todo o Estado de SP'
  });

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchSEOPages();
      fetchProfessionals();
      fetchRequests();
      fetchProjects();
      fetchCompanySettings();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro no login.');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSEOPages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/seo-list');
      if (response.ok) {
        const data = await response.json();
        setSeoPages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSEO = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/seo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchSEOPages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/professionals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data);
      }
    } catch (err) {
      console.error('Erro ao buscar profissionais:', err);
    }
  };

  const handleUpdateProfessionalStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/professionals/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchProfessionals();
      }
    } catch (err) {
      console.error('Erro ao atualizar profissional:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Erro ao buscar solicitações:', err);
    }
  };

  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/settings');
      if (response.ok) {
        const data = await response.json();
        setCompanySettings(data);
      }
    } catch (err) {
      console.error('Erro ao buscar configurações da empresa:', err);
    }
  };

  const handleSaveCompanySettings = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companySettings)
      });
      if (response.ok) {
        alert('Configurações institucionais salvas com sucesso!');
        fetchCompanySettings();
      } else {
        const err = await response.json();
        throw new Error(err.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanySettings(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
    }
  };

  const handleFileUpload = (e, field, isProject = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isProject) {
          setNewProject(prev => ({ ...prev, [field]: reader.result }));
        } else {
          setNewSEO(prev => ({ ...prev, [field]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });
      if (response.ok) {
        alert('Projeto do Portfólio criado/atualizado com sucesso!');
        fetchProjects();
        setNewProject({
          titulo: '',
          categoria: 'Residencial',
          localizacao: '',
          metragem: '',
          tempoExecucao: '',
          imagemAntes: '',
          imagemDepois: '',
          escopo: ''
        });
      } else {
        const err = await response.json();
        throw new Error(err.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Deseja realmente remover este projeto do portfólio?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSEO = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/seo-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSEO)
      });
      if (response.ok) {
        alert('Página de SEO Local criada/atualizada com sucesso!');
        fetchSEOPages();
        setNewSEO({
          servico: '',
          cidade: '',
          bairro: 'Centro',
          tituloSEO: '',
          descricaoSEO: '',
          conteudoH1: '',
          textoPersonalizado: '',
          imagemAntes: '',
          imagemDepois: ''
        });
      } else {
        const err = await response.json();
        throw new Error(err.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <>
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          padding: '24px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ background: 'var(--accent-glow)', padding: '12px', borderRadius: '50%' }}>
                <Lock size={32} color="var(--accent-color)" />
              </div>
            </div>
            <h2 style={{ textAlign: 'center', fontWeight: 800, marginBottom: '24px' }}>Painel Administrativo</h2>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">E-mail Corporativo</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="admin@1001obra.com.br"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Senha</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Sua senha"
                  required 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Entrar no Sistema
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Dashboard 1001 Obra</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Gerenciamento de Leads e SEO Local</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            Sair do Painel
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '12px' }}>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`btn-secondary ${activeTab === 'leads' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'leads' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'leads' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <Users size={18} /> Leads Recebidos
          </button>
          <button 
            onClick={() => setActiveTab('seo')}
            className={`btn-secondary ${activeTab === 'seo' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'seo' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'seo' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <FileText size={18} /> SEO Local (Páginas)
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`btn-secondary ${activeTab === 'portfolio' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'portfolio' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'portfolio' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <Plus size={18} /> Portfólio de Obras
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`btn-secondary ${activeTab === 'settings' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'settings' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'settings' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <Settings size={18} /> Dados da Empresa (Logo & Contatos)
          </button>
          <button 
            onClick={() => setActiveTab('professionals')}
            className={`btn-secondary ${activeTab === 'professionals' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'professionals' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'professionals' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <Users size={18} /> Profissionais (Parceiros)
          </button>
          <button 
            onClick={() => { setActiveTab('finance'); fetchRequests(); }}
            className={`btn-secondary ${activeTab === 'finance' ? 'active-tab' : ''}`}
            style={{ 
              border: 'none', 
              background: activeTab === 'finance' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'finance' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            <DollarSign size={18} /> Financeiro & Chamados
          </button>
        </div>

        {/* Tab Content: LEADS */}
        {activeTab === 'leads' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Últimos Leads Capturados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leads.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Nenhum lead recebido ainda.</p>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="glass-card" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{lead.nome}</h3>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: lead.status === 'Novo' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: lead.status === 'Novo' ? '#3b82f6' : '#10b981',
                          fontWeight: 700
                        }}>{lead.status}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Telefone:</strong> {lead.telefone}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Assunto:</strong> {lead.assunto}</p>
                      {lead.descricao && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>"{lead.descricao}"</p>}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleUpdateStatus(lead.id, 'Convertido')} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#10b981' }}
                      >
                        Marcar Convertido
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(lead.id, 'Descartado')} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444' }}
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: SEO */}
        {activeTab === 'seo' && (
          <div className="grid-2" style={{ alignItems: 'flex-start' }}>
            {/* Create / Edit Form */}
            <div className="glass-card" style={{ border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={20} /> Cadastrar Nova Região
              </h2>
              
              <form onSubmit={handleCreateSEO} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Selecionar Serviço</label>
                    <select 
                      className="form-control"
                      required
                      value={newSEO.servico}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setNewSEO({ 
                          ...newSEO, 
                          servico: selectedVal,
                          servicoSlug: selectedVal.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
                        });
                      }}
                    >
                      <option value="">Selecione o Serviço...</option>
                      <option value="Construção de Paredes">Construção de Paredes</option>
                      <option value="Fundações & Vigas">Fundações & Vigas</option>
                      <option value="Demolição Técnica">Demolição Técnica</option>
                      <option value="Pintura Interna/Externa">Pintura Interna/Externa</option>
                      <option value="Aplicação de Porcelanato">Aplicação de Porcelanato</option>
                      <option value="Massa Corrida & Texturas">Massa Corrida & Texturas</option>
                      <option value="Instalações Elétricas">Instalações Elétricas</option>
                      <option value="Rede Hidráulica e Esgoto">Rede Hidráulica e Esgoto</option>
                      <option value="Sistemas de Incêndio">Sistemas de Incêndio</option>
                      <option value="Emissão de ART">Emissão de ART</option>
                      <option value="Regularização de AVCB">Regularização de AVCB</option>
                      <option value="Manutenção Predial PMOC">Manutenção Predial PMOC</option>
                      <option value="Forro de Gesso Rebaixado">Forro de Gesso Rebaixado</option>
                      <option value="Paredes em Drywall">Paredes em Drywall</option>
                      <option value="Sancas Decorativas">Sancas Decorativas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: São Paulo ou Cabreúva"
                      required 
                      value={newSEO.cidade}
                      onChange={(e) => setNewSEO({ ...newSEO, cidade: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Centro"
                    required 
                    value={newSEO.bairro}
                    onChange={(e) => setNewSEO({ ...newSEO, bairro: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Título SEO (Tag Title)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Deixe em branco para auto-gerar"
                    value={newSEO.tituloSEO}
                    onChange={(e) => setNewSEO({ ...newSEO, tituloSEO: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Description</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Deixe em branco para auto-gerar"
                    value={newSEO.descricaoSEO}
                    onChange={(e) => setNewSEO({ ...newSEO, descricaoSEO: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Título H1 da Página</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Deixe em branco para auto-gerar"
                    value={newSEO.conteudoH1}
                    onChange={(e) => setNewSEO({ ...newSEO, conteudoH1: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Texto Detalhado da Página</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Descreva o serviço para esta região (otimização local)..."
                    rows={3}
                    value={newSEO.textoPersonalizado}
                    onChange={(e) => setNewSEO({ ...newSEO, textoPersonalizado: e.target.value })}
                  />
                </div>

                {/* Imagem Antes */}
                <div style={{ border: '1px dashed var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    📸 Imagem do ANTES
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="Cole a URL da imagem antes (https://...)"
                    style={{ marginBottom: '8px' }}
                    value={newSEO.imagemAntes}
                    onChange={(e) => setNewSEO({ ...newSEO, imagemAntes: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ou envie o arquivo de imagem:</div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imagemAntes')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {newSEO.imagemAntes && (
                    <img src={newSEO.imagemAntes} alt="Antes Preview" style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                  )}
                </div>

                {/* Imagem Depois */}
                <div style={{ border: '1px dashed var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    ✨ Imagem do DEPOIS
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="Cole a URL da imagem depois (https://...)"
                    style={{ marginBottom: '8px' }}
                    value={newSEO.imagemDepois}
                    onChange={(e) => setNewSEO({ ...newSEO, imagemDepois: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ou envie o arquivo de imagem:</div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imagemDepois')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {newSEO.imagemDepois && (
                    <img src={newSEO.imagemDepois} alt="Depois Preview" style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  Salvar Página Local com Imagens
                </button>
              </form>
            </div>

            {/* List of services & custom page overrides */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Gerenciador de Serviços & Imagens</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Selecione qualquer serviço abaixo para alterar suas imagens de Antes/Depois ou textos em tempo real.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '700px', overflowY: 'auto', paddingRight: '4px' }}>
                {[
                  { name: "Construção de Paredes", slug: "construcao-de-paredes" },
                  { name: "Fundações & Vigas", slug: "fundacoes-e-vigas" },
                  { name: "Demolição Técnica", slug: "demolicao-tecnica" },
                  { name: "Pintura Interna/Externa", slug: "pintura-interna-externa" },
                  { name: "Aplicação de Porcelanato", slug: "aplicacao-de-porcelanato" },
                  { name: "Massa Corrida & Texturas", slug: "massa-corrida-e-texturas" },
                  { name: "Instalações Elétricas", slug: "instalacoes-eletricas" },
                  { name: "Rede Hidráulica e Esgoto", slug: "rede-hidraulica-e-esgoto" },
                  { name: "Sistemas de Incêndio", slug: "sistemas-de-incendio" },
                  { name: "Emissão de ART", slug: "emissao-de-art" },
                  { name: "Regularização de AVCB", slug: "regularizacao-de-avcb" },
                  { name: "Manutenção Predial PMOC", slug: "manutencao-predial-pmoc" },
                  { name: "Forro de Gesso Rebaixado", slug: "forro-de-gesso-rebaixado" },
                  { name: "Paredes em Drywall", slug: "paredes-em-drywall" },
                  { name: "Sancas Decorativas", slug: "sancas-decorativas" }
                ].map((item) => {
                  const existingPage = seoPages.find(p => p.servicoSlug === item.slug);
                  const hasBefore = existingPage?.imagemAntes;
                  const hasAfter = existingPage?.imagemDepois;

                  return (
                    <div key={item.slug} className="glass-card" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px'
                    }}>
                      <div>
                        <h4 style={{ fontWeight: 800, margin: 0 }}>{item.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          /locais/{item.slug}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '0.75rem', background: hasBefore ? 'var(--accent-glow)' : 'var(--bg-tertiary)', color: hasBefore ? 'var(--accent-color)' : 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px' }}>
                            {hasBefore ? '📷 Antes Personalizado' : '📷 Foto Padrão'}
                          </span>
                          <span style={{ fontSize: '0.75rem', background: hasAfter ? 'var(--accent-glow)' : 'var(--bg-tertiary)', color: hasAfter ? 'var(--accent-color)' : 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px' }}>
                            {hasAfter ? '✨ Depois Personalizado' : '✨ Foto Padrão'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#000' }}
                          onClick={() => {
                            setNewSEO({
                              servico: item.name,
                              servicoSlug: item.slug,
                              cidade: existingPage?.cidade || 'São Paulo',
                              cidadeSlug: existingPage?.cidadeSlug || 'sao-paulo',
                              bairro: existingPage?.bairro || 'Centro',
                              tituloSEO: existingPage?.tituloSEO || '',
                              descricaoSEO: existingPage?.descricaoSEO || '',
                              conteudoH1: existingPage?.conteudoH1 || '',
                              textoPersonalizado: existingPage?.textoPersonalizado || '',
                              imagemAntes: existingPage?.imagemAntes || '',
                              imagemDepois: existingPage?.imagemDepois || ''
                            });
                          }}
                        >
                          Alterar Imagens
                        </button>
                        {existingPage && (
                          <button 
                            onClick={() => handleDeleteSEO(existingPage.id)}
                            style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            title="Resetar para o padrão"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="grid-2" style={{ alignItems: 'flex-start' }}>
            {/* Create / Edit Portfolio Project Form */}
            <div className="glass-card" style={{ border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={20} /> Cadastrar / Editar Obra no Portfólio
              </h2>
              
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Título da Obra</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Reforma de Fachada Comercial"
                    required 
                    value={newProject.titulo}
                    onChange={(e) => setNewProject({ ...newProject, titulo: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Categoria</label>
                    <select 
                      className="form-control"
                      value={newProject.categoria}
                      onChange={(e) => setNewProject({ ...newProject, categoria: e.target.value })}
                    >
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Predial">Predial</option>
                      <option value="Condominial">Condominial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Localização</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Centro, Jundiaí - SP"
                      required 
                      value={newProject.localizacao}
                      onChange={(e) => setNewProject({ ...newProject, localizacao: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Metragem (opcional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: 280 m²"
                      value={newProject.metragem}
                      onChange={(e) => setNewProject({ ...newProject, metragem: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tempo de Obra (opcional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: 25 dias"
                      value={newProject.tempoExecucao}
                      onChange={(e) => setNewProject({ ...newProject, tempoExecucao: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição / Escopo Técnico</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Detalhamento dos serviços realizados..."
                    rows={3}
                    value={newProject.escopo}
                    onChange={(e) => setNewProject({ ...newProject, escopo: e.target.value })}
                  />
                </div>

                {/* Imagem Antes Projeto */}
                <div style={{ border: '1px dashed var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    📸 Foto do ANTES (Portfólio)
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="URL da imagem (https://...)"
                    style={{ marginBottom: '8px' }}
                    value={newProject.imagemAntes}
                    onChange={(e) => setNewProject({ ...newProject, imagemAntes: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ou envie o arquivo:</div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imagemAntes', true)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {newProject.imagemAntes && (
                    <img src={newProject.imagemAntes} alt="Antes Preview" style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                  )}
                </div>

                {/* Imagem Depois Projeto */}
                <div style={{ border: '1px dashed var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    ✨ Foto do DEPOIS (Portfólio)
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="URL da imagem (https://...)"
                    style={{ marginBottom: '8px' }}
                    value={newProject.imagemDepois}
                    onChange={(e) => setNewProject({ ...newProject, imagemDepois: e.target.value })}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ou envie o arquivo:</div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imagemDepois', true)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {newProject.imagemDepois && (
                    <img src={newProject.imagemDepois} alt="Depois Preview" style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  Salvar Obra no Portfólio
                </button>
              </form>
            </div>

            {/* List of Portfolio Projects */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Obras Cadastradas no Portfólio</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Clique em "Alterar Fotos / Editar" em qualquer obra abaixo para trocar as fotos do Antes e Depois.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '700px', overflowY: 'auto' }}>
                {[
                  {
                    titulo: "Retrofit e Reforma de Fachada Comercial",
                    categoria: "Comercial",
                    localizacao: "Centro, Jundiaí - SP",
                    metragem: "280 m²",
                    tempoExecucao: "25 dias",
                    escopo: "Retrofit completo de fachada comercial antiga. Remoção de revestimento desgastado, tratamento reboco, instalação de detalhes em ACM e pintura elastomérica de alta durabilidade.",
                    imagemAntes: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
                    imagemDepois: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    titulo: "Forro de Gesso Rebaixado com Sanca Iluminada",
                    categoria: "Residencial",
                    localizacao: "Alphaville, Santana de Parnaíba - SP",
                    metragem: "65 m²",
                    tempoExecucao: "10 dias",
                    escopo: "Substituição de teto de madeira aparente por forro rebaixado de gesso acartonado estruturado, criação de sancas iluminadas e instalação de iluminação LED embutida.",
                    imagemAntes: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
                    imagemDepois: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    titulo: "Reforma de Acabamento e Pintura de Living",
                    categoria: "Residencial",
                    localizacao: "Cabreúva - SP",
                    metragem: "110 m²",
                    tempoExecucao: "18 dias",
                    escopo: "Restauração de paredes com umidade, aplicação de massa corrida niveladora, lixamento mecanizado sem poeira e pintura premium com acabamento fosco aveludado.",
                    imagemAntes: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
                    imagemDepois: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    titulo: "Divisórias em Drywall e Iluminação Embutida",
                    categoria: "Comercial",
                    localizacao: "Pinheiros, São Paulo - SP",
                    metragem: "140 m²",
                    tempoExecucao: "15 dias",
                    escopo: "Fechamento de ambientes corporativos usando paredes de Drywall acústico com lã de vidro interna, pintura lavável acetinada e instalação de linhas contínuas de LED.",
                    imagemAntes: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop",
                    imagemDepois: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    titulo: "Manutenção Elétrica e Sistemas Hidráulicos",
                    categoria: "Predial",
                    localizacao: "Cabreúva - SP",
                    metragem: "450 m²",
                    tempoExecucao: "35 dias",
                    escopo: "Adequação de prumadas e tubulações de incêndio, substituição de fiação antiga de cobre, reorganização de quadros de distribuição elétrica de disjuntores e teste de carga.",
                    imagemAntes: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
                    imagemDepois: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"
                  }
                ].map((defaultProj) => {
                  const saved = projects.find(p => p.titulo === defaultProj.titulo);
                  const currentProj = saved || defaultProj;

                  return (
                    <div key={currentProj.titulo} className="glass-card" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            {currentProj.categoria}
                          </span>
                          {saved && (
                            <span style={{ fontSize: '0.75rem', background: '#10b98122', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              Personalizado
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontWeight: 800, marginTop: '4px', marginBottom: '2px' }}>{currentProj.titulo}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          📍 {currentProj.localizacao} {currentProj.metragem ? `• ${currentProj.metragem}` : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#000' }}
                          onClick={() => {
                            setNewProject({
                              titulo: currentProj.titulo,
                              categoria: currentProj.categoria,
                              localizacao: currentProj.localizacao,
                              metragem: currentProj.metragem || '',
                              tempoExecucao: currentProj.tempoExecucao || '',
                              imagemAntes: currentProj.imagemAntes || '',
                              imagemDepois: currentProj.imagemDepois || '',
                              escopo: currentProj.escopo || ''
                            });
                          }}
                        >
                          Alterar Fotos / Editar
                        </button>
                        {saved && (
                          <button 
                            onClick={() => handleDeleteProject(saved.id)}
                            style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            title="Resetar para o Padrão"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: PROFESSIONALS */}
        {activeTab === 'professionals' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Profissionais e Parceiros Cadastrados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {professionals.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Nenhum profissional cadastrado ainda.</p>
              ) : (
                professionals.map((prof) => (
                  <div key={prof.id} className="glass-card" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{prof.nome}</h3>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: prof.status === 'Pendente' ? 'rgba(245, 158, 11, 0.2)' : prof.status === 'Aprovado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: prof.status === 'Pendente' ? 'var(--accent-color)' : prof.status === 'Aprovado' ? '#10b981' : '#ef4444',
                          fontWeight: 700
                        }}>{prof.status}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <strong>WhatsApp:</strong> {prof.telefone} | <strong>E-mail:</strong> {prof.email || 'Não informado'}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <strong>Especialidade:</strong> {prof.especialidade} | <strong>Cidade:</strong> {prof.cidade}
                      </p>
                      {prof.experiencia && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                          <strong>Experiência:</strong> {prof.experiencia}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleUpdateProfessionalStatus(prof.id, 'Aprovado')}
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        disabled={prof.status === 'Aprovado'}
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => handleUpdateProfessionalStatus(prof.id, 'Reprovado')}
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
                        disabled={prof.status === 'Reprovado'}
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: FINANCE & HISTORY */}
        {activeTab === 'finance' && (() => {
          const completedJobs = requests.filter(r => r.status === 'Finalizado');
          const totalBilled = completedJobs.reduce((acc, r) => acc + parseFloat(r.precoEstimado || 0), 0);
          const totalFees = completedJobs.reduce((acc, r) => acc + parseFloat(r.taxaIntermediacao || 0), 0);
          const totalPaid = totalBilled - totalFees;

          return (
            <div>
              {/* KPIs Dashboard */}
              <div className="grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Volume de Vendas (Total)</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-color)', margin: '8px 0 0 0' }}>
                    R$ {totalBilled.toFixed(2)}
                  </h3>
                </div>
                <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Taxas de Intermediação</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '8px 0 0 0' }}>
                    R$ {totalFees.toFixed(2)}
                  </h3>
                </div>
                <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pago aos Parceiros</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 0 0' }}>
                    R$ {totalPaid.toFixed(2)}
                  </h3>
                </div>
                <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Chamados Concluídos</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    {completedJobs.length} chamados
                  </h3>
                </div>
              </div>

              {/* Histórico completo de solicitações */}
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Histórico Completo de Chamados</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {requests.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Nenhum chamado aberto na plataforma até o momento.</p>
                ) : (
                  requests.map((req) => {
                    const comissaoProf = parseFloat(req.precoEstimado) - parseFloat(req.taxaIntermediacao);
                    return (
                      <div key={req.id} className="glass-card" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                              {req.servicoSelecionado}
                            </h3>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: req.status === 'Buscando' ? 'rgba(59, 130, 246, 0.2)' : req.status === 'Aceito' ? 'rgba(245, 158, 11, 0.2)' : req.status === 'Finalizado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: req.status === 'Buscando' ? '#3b82f6' : req.status === 'Aceito' ? 'var(--accent-color)' : req.status === 'Finalizado' ? '#10b981' : '#ef4444',
                              fontWeight: 700
                            }}>{req.status}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <strong>Cliente:</strong> {req.clienteNome} ({req.clienteTelefone}) | <strong>Região:</strong> {req.bairro}, {req.cidade}
                          </p>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <strong>Tipo:</strong> {req.tipoPreco} {req.tipoPreco === 'Preço Fechado' ? `(${req.metragem} m²)` : `(${req.quantidadeDias} dias)`}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ID do Chamado: {req.id} | Solicitado em: {new Date(req.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>R$ {parseFloat(req.precoEstimado).toFixed(2)}</div>
                          <div style={{ fontSize: '0.8rem', color: '#10b981' }}>Comissão Plataforma: R$ {parseFloat(req.taxaIntermediacao).toFixed(2)} (15%)</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Profissional: R$ {comissaoProf.toFixed(2)} (85%)</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}

        {/* Tab Content: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-card" style={{ maxWidth: '700px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={22} color="var(--accent-color)" /> Configurações Institucionais da Empresa
            </h2>
            
            <form onSubmit={handleSaveCompanySettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Logo da Empresa */}
              <div style={{ border: '1px dashed var(--border-color)', padding: '16px', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                  🖼️ Logo Oficial da Empresa
                </label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img 
                    src={companySettings.logoUrl || '/logo.png'} 
                    alt="Logo Preview" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="Cole a URL da imagem da Logo (https://...)"
                      value={companySettings.logoUrl}
                      onChange={(e) => setCompanySettings({ ...companySettings, logoUrl: e.target.value })}
                    />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ou selecione o arquivo do seu computador/celular:</div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome da Empresa</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={companySettings.nomeEmpresa}
                  onChange={(e) => setCompanySettings({ ...companySettings, nomeEmpresa: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Telefone de Contato (Exibição)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="(11) 96511-1670"
                    required 
                    value={companySettings.telefone}
                    onChange={(e) => setCompanySettings({ ...companySettings, telefone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Número do WhatsApp (apenas números)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="5511965111670"
                    required 
                    value={companySettings.whatsapp}
                    onChange={(e) => setCompanySettings({ ...companySettings, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Atendimento</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Horário de Funcionamento</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Seg a Sáb: 08:00 às 18:00"
                  required 
                  value={companySettings.horarioFuncionamento}
                  onChange={(e) => setCompanySettings({ ...companySettings, horarioFuncionamento: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Endereço / Região de Atendimento</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Atendimento em todo o Estado de SP"
                  value={companySettings.endereco}
                  onChange={(e) => setCompanySettings({ ...companySettings, endereco: e.target.value })}
                />
              </div>

              {/* Redes Sociais */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-color)' }}>
                  🌐 Links das Redes Sociais (Rodapé)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Instagram</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://instagram.com/suapagina"
                      value={companySettings.instagram || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, instagram: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Facebook</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://facebook.com/suapagina"
                      value={companySettings.facebook || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, facebook: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>LinkedIn</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://linkedin.com/company/suapagina"
                      value={companySettings.linkedin || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>YouTube</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://youtube.com/@seucanal"
                      value={companySettings.youtube || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, youtube: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SEO & Indexação no Google */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px', color: 'var(--accent-color)' }}>
                  🔍 SEO Global & Indexação no Google
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Configurações que aparecem no resultado de busca do Google, Bing e ao compartilhar o link no WhatsApp/redes.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Meta Título (Aparece na aba e no Google)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: 1001 Obra - Engenharia, Reformas e Manutenção Predial em SP"
                      value={companySettings.metaTitulo || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, metaTitulo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Meta Descrição (Resumo no Google)</label>
                    <textarea 
                      className="form-control" 
                      rows={2}
                      placeholder="Resumo exibido abaixo do título nos resultados de busca do Google..."
                      value={companySettings.metaDescricao || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, metaDescricao: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Palavras-Chave (Separadas por vírgula)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="reformas sp, engenharia civil, pedreiro, drywall, pintura"
                      value={companySettings.metaPalavrasChave || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, metaPalavrasChave: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>URL da Imagem de Banner para Compartilhamento (Open Graph / WhatsApp)</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://... (Imagem exibida ao enviar link no WhatsApp)"
                      value={companySettings.ogImage || ''}
                      onChange={(e) => setCompanySettings({ ...companySettings, ogImage: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px', padding: '12px' }}>
                Salvar Todas as Configurações
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
