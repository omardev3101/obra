import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, MapPin, Phone, Calculator, ChevronDown, CheckCircle2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [location, setLocation] = useState(localStorage.getItem('custom_location') || 'Escolher Cidade...');
  const [showSelector, setShowSelector] = useState(false);
  const [tempCidade, setTempCidade] = useState('São Paulo');
  const [cidadesSP, setCidadesSP] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    nomeEmpresa: '1001 OBRA',
    logoUrl: '/logo.png',
    telefone: '(11) 96511-1670',
    whatsapp: '5511965111670'
  });

  useEffect(() => {
    // Carrega a lista de municípios de SP da API oficial do IBGE
    const fetchCidadesSP = async () => {
      setLoadingCidades(true);
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios?orderBy=nome');
        if (res.ok) {
          const data = await res.json();
          setCidadesSP(data.map(m => m.nome));
        }
      } catch (err) {
        console.warn('Erro ao carregar cidades de SP do IBGE:', err);
      } finally {
        setLoadingCidades(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setCompanySettings(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar configurações da empresa no Header:', err);
      }
    };

    fetchCidadesSP();
    fetchSettings();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Busca localização do path ou busca geolocalização real baseada em coordenadas
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.includes('locais') && pathParts.length >= 4) {
      const cidade = pathParts[3];
      const formatSlug = (slug) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setLocation(formatSlug(cidade));
    } else {
      if (localStorage.getItem('custom_location')) {
        return;
      }
      
      const fetchLocationByIP = async () => {
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            const cidade = data.city || '';
            if (cidade) {
              setLocation(cidade);
              localStorage.setItem('custom_location', cidade);
              return true;
            }
          }
        } catch (ipErr) {
          console.warn('Erro ao buscar localização por IP:', ipErr);
        }
        return false;
      };

      if (navigator.geolocation) {
        setLocation('Detectando...');
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
              if (response.ok) {
                const data = await response.json();
                const cidade = data.city || data.localityInfo?.administrative?.[1]?.name || '';
                if (cidade) {
                  setLocation(cidade);
                  localStorage.setItem('custom_location', cidade);
                  return;
                }
              }
            } catch (err) {
              console.warn('Erro na geolocalização reversa:', err);
            }
            const success = await fetchLocationByIP();
            if (!success) {
              setLocation('Escolher Cidade...');
              setShowSelector(true);
            }
          },
          async (err) => {
            console.warn('Permissão de geolocalização negada ou erro:', err.message);
            const success = await fetchLocationByIP();
            if (!success) {
              setLocation('Escolher Cidade...');
              setShowSelector(true);
            }
          },
          { timeout: 8000, maximumAge: 60000 }
        );
      } else {
        fetchLocationByIP().then((success) => {
          if (!success) {
            setLocation('Escolher Cidade...');
            setShowSelector(true);
          }
        });
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getDynamicLocationSlugs = () => {
    const customLoc = localStorage.getItem('custom_location');
    let cidadeSlug = 'cabreuva';

    if (customLoc) {
      const formatSlug = (str) => str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      cidadeSlug = formatSlug(customLoc);
    } else {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.includes('locais') && pathParts.length >= 4) {
        cidadeSlug = pathParts[3];
      }
    }
    return { cidadeSlug };
  };

  const { cidadeSlug: currentCidadeSlug } = getDynamicLocationSlugs();

  const menuCategories = [
    {
      title: "Alvenaria & Estrutural",
      items: [
        { name: "Construção de Paredes", slug: "construcao-de-paredes" },
        { name: "Fundações & Vigas", slug: "fundacoes-e-vigas" },
        { name: "Demolição Técnica", slug: "demolicao-tecnica" }
      ]
    },
    {
      title: "Acabamento & Pintura",
      items: [
        { name: "Pintura Interna/Externa", slug: "pintura-interna-externa" },
        { name: "Aplicação de Porcelanato", slug: "aplicacao-de-porcelanato" },
        { name: "Massa Corrida & Texturas", slug: "massa-corrida-e-texturas" }
      ]
    },
    {
      title: "Elétrica & Hidráulica",
      items: [
        { name: "Instalações Elétricas", slug: "instalacoes-eletricas" },
        { name: "Rede Hidráulica e Esgoto", slug: "rede-hidraulica-e-esgoto" },
        { name: "Sistemas de Incêndio", slug: "sistemas-de-incendio" }
      ]
    },
    {
      title: "Engenharia & Laudos",
      items: [
        { name: "Emissão de ART", slug: "emissao-de-art" },
        { name: "Regularização de AVCB", slug: "regularizacao-de-avcb" },
        { name: "Manutenção Predial PMOC", slug: "manutencao-predial-pmoc" }
      ]
    },
    {
      title: "Drywall & Gesso",
      items: [
        { name: "Forro de Gesso Rebaixado", slug: "forro-de-gesso-rebaixado" },
        { name: "Paredes em Drywall", slug: "paredes-em-drywall" },
        { name: "Sancas Decorativas", slug: "sancas-decorativas" }
      ]
    }
  ];

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={(companySettings.logoUrl && companySettings.logoUrl !== '/logo.png') ? companySettings.logoUrl : "/obra/logo.png"} 
            alt={`${companySettings.nomeEmpresa} Logo`} 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid var(--accent-color)'
            }} 
          />
          <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>{companySettings.nomeEmpresa || '1001 OBRA'}</span>
        </Link>

        {/* Mega Menu para Desktop */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-menu">
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'servicos' ? null : 'servicos')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Serviços <ChevronDown size={16} />
            </button>

            {activeDropdown === 'servicos' && (
              <div className="glass-card" style={{
                position: 'absolute',
                top: '40px',
                left: '-200px',
                width: '850px',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '20px',
                padding: '24px',
                zIndex: 110,
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {menuCategories.map((cat, idx) => (
                  <div key={idx}>
                    <h4 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 800, 
                      color: 'var(--accent-color)',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>{cat.title}</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link 
                            to={`/locais/${item.slug}/${currentCidadeSlug}`}
                            onClick={() => setActiveDropdown(null)}
                            style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to="/#portfolio" style={{ fontWeight: 600 }}>Portfólio</Link>
           <Link to="/#calculadora" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calculator size={16} /> Simulador
          </Link>
          <Link to="/chamar-profissional" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-color)' }}>
            <Zap size={16} /> Chamar Profissional
          </Link>
          <Link to="/admin" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Painel Admin</Link>
        </nav>

        {/* Informações Auxiliares & Botões */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Geo-Localização Clicável e Editável */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowSelector(!showSelector)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'var(--bg-tertiary)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }} className="location-badge"
            >
              <MapPin size={14} color="var(--accent-color)" />
              <span>{location}</span>
            </button>

            {showSelector && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tempCidade) {
                    setLocation(tempCidade);
                    localStorage.setItem('custom_location', tempCidade);
                    setShowSelector(false);

                    const formatSlug = (str) => str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
                    const cSlug = formatSlug(tempCidade);

                    const pathParts = window.location.pathname.split('/');
                    if (pathParts.includes('locais') && pathParts.length >= 4) {
                      const servicoSlug = pathParts[2];
                      navigate(`/locais/${servicoSlug}/${cSlug}`);
                    } else {
                      navigate(`/locais/manutencao-predial-pmoc/${cSlug}`);
                    }
                  }
                }}
                className="glass-card" 
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '260px',
                  padding: '16px',
                  zIndex: 120,
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>Escolha sua Cidade</h4>
                <select
                  value={tempCidade}
                  onChange={(e) => setTempCidade(e.target.value)}
                  required
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    maxHeight: '150px'
                  }}
                >
                  {loadingCidades && <option value="">Carregando cidades de SP...</option>}
                  {!loadingCidades && cidadesSP.length === 0 && (
                    <>
                      <option value="São Paulo">São Paulo</option>
                      <option value="Cabreúva">Cabreúva</option>
                      <option value="Campinas">Campinas</option>
                      <option value="Jundiaí">Jundiaí</option>
                      <option value="Sorocaba">Sorocaba</option>
                      <option value="Guarulhos">Guarulhos</option>
                      <option value="Osasco">Osasco</option>
                      <option value="Santo André">Santo André</option>
                      <option value="São Bernardo do Campo">São Bernardo do Campo</option>
                    </>
                  )}
                  {cidadesSP.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    justifyContent: 'center',
                    color: '#000'
                  }}
                >
                  Confirmar Região
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp Direct Call */}
          <a 
            href="https://wa.me/5511965111670" 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#10b981',
              fontWeight: 700
            }}
            className="whatsapp-call"
          >
            <Phone size={16} />
            <span>Contato</span>
          </a>

          {/* Theme Switcher */}
          <button onClick={toggleTheme} style={{ color: 'var(--text-primary)' }} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Menu Mobile Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={{ color: 'var(--text-primary)', zIndex: 1001, pointerEvents: 'auto' }}
            className="mobile-toggle"
            aria-label="Menu Mobile"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown Panel */}
      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-secondary)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>🏠 Home</Link>
          <Link to="/pedreiro-para-reformas" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>🧱 Pedreiro para Reformas</Link>
          <Link to="/#portfolio" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>🏗️ Portfólio de Obras</Link>
          <Link to="/#calculadora" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>🧮 Simulador de Custos</Link>
          <Link to="/chamar-profissional" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>⚡ Chamar Profissional (Uber)</Link>
          <Link to="/trabalhe-conosco" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>👷 Trabalhe Conosco</Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔐 Painel Admin</Link>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
            <h4 style={{ color: 'var(--accent-color)', fontWeight: 800, marginBottom: '12px', fontSize: '1.1rem' }}>Especialidades Rápidas</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Link to={`/locais/pintura-interna-externa/${currentCidadeSlug}/${currentBairroSlug}`} onClick={() => setIsOpen(false)} style={{ padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>Pintura</Link>
              <Link to={`/locais/paredes-em-drywall/${currentCidadeSlug}/${currentBairroSlug}`} onClick={() => setIsOpen(false)} style={{ padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>Drywall</Link>
              <Link to={`/locais/instalacoes-eletricas/${currentCidadeSlug}/${currentBairroSlug}`} onClick={() => setIsOpen(false)} style={{ padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>Elétrica</Link>
              <Link to={`/locais/manutencao-predial-pmoc/${currentCidadeSlug}/${currentBairroSlug}`} onClick={() => setIsOpen(false)} style={{ padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>PMOC / ART</Link>
            </div>
          </div>
        </div>
      )}

      {/* CSS customizado para ocultar menus dinamicamente */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu, .location-badge, .whatsapp-call span {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
