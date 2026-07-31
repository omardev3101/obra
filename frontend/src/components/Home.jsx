import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Calculator from './Calculator';
import LeadModal from './LeadModal';
import BeforeAfterSlider from './BeforeAfterSlider';
import { Star, Shield, HardHat, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import Footer from './Footer';

// Componente para contagem animada
const Counter = ({ end, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Easing de desaceleração suave (easeOutQuad)
            const currentVal = Math.floor(progress * (2 - progress) * end);
            setCount(currentVal);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  const formattedCount = count.toLocaleString('pt-BR');

  return (
    <span ref={counterRef}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLeadData, setActiveLeadData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [dbProjects, setDbProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDbProjects(data);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar projetos do portfólio:', err);
      }
    };
    fetchProjects();
  }, []);

  const handleOpenLeadModal = (data) => {
    setActiveLeadData(data);
    setModalOpen(true);
  };

  const getDynamicSlugs = () => {
    const customLoc = localStorage.getItem('custom_location');
    let bairroSlug = 'centro';
    let cidadeSlug = 'cabreuva';

    if (customLoc) {
      const formatSlug = (str) => str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      const parts = customLoc.split(',');
      if (parts.length >= 2) {
        bairroSlug = formatSlug(parts[0]);
        cidadeSlug = formatSlug(parts[1]);
      }
    }
    return { cidadeSlug, bairroSlug };
  };

  const { cidadeSlug: currentCidade, bairroSlug: currentBairro } = getDynamicSlugs();

  const servicesList = [
    { title: "Pintura Residencial & Comercial", desc: "Aplicação de tintas premium, massa corrida e texturas protetoras com acabamento impecável.", slug: "pintura-interna-externa" },
    { title: "Instalação de Drywall & Gesso", desc: "Forro rebaixado, sancas decorativas e divisórias termoacústicas de alta resistência.", slug: "paredes-em-drywall" },
    { title: "Manutenção Predial e PMOC", desc: "Gestão completa de infraestrutura predial, sistemas elétricos, hidráulicos e ar condicionado.", slug: "manutencao-predial-pmoc" },
    { title: "Porcelanato e Revestimentos", desc: "Assentamento de alto padrão de cerâmicas, porcelanatos e azulejos em geral.", slug: "aplicacao-de-porcelanato" }
  ];

  const portfolioProjects = [
    {
      title: "Retrofit e Reforma de Fachada Comercial",
      category: "Comercial",
      company: "1001 Obra",
      date: "Fevereiro 2026",
      metragem: "280 m²",
      duration: "25 dias",
      location: "Centro, Jundiaí - SP",
      scope: "Retrofit completo de fachada comercial antiga. Remoção de revestimento desgastado, tratamento reboco, instalação de detalhes em ACM e pintura elastomérica de alta durabilidade.",
      before: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Forro de Gesso Rebaixado com Sanca Iluminada",
      category: "Residencial",
      company: "1001 Obra",
      date: "Março 2026",
      metragem: "65 m²",
      duration: "10 dias",
      location: "Alphaville, Santana de Parnaíba - SP",
      scope: "Substituição de teto de madeira aparente por forro rebaixado de gesso acartonado estruturado, criação de sancas iluminadas e instalação de iluminação LED embutida.",
      before: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Reforma de Acabamento e Pintura de Living",
      category: "Residencial",
      company: "1001 Obra",
      date: "Abril 2026",
      metragem: "110 m²",
      duration: "18 dias",
      location: "Cabreúva - SP",
      scope: "Restauração de paredes com umidade, aplicação de massa corrida niveladora, lixamento mecanizado sem poeira e pintura premium com acabamento fosco aveludado.",
      before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Divisórias em Drywall e Iluminação Embutida",
      category: "Comercial",
      company: "1001 Obra",
      date: "Maio 2026",
      metragem: "140 m²",
      duration: "15 dias",
      location: "Pinheiros, São Paulo - SP",
      scope: "Fechamento de ambientes corporativos usando paredes de Drywall acústico com lã de vidro interna, pintura lavável acetinada e instalação de linhas contínuas de LED.",
      before: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Manutenção Elétrica e Sistemas Hidráulicos",
      category: "Predial",
      company: "1001 Obra",
      date: "Junho 2026",
      metragem: "450 m²",
      duration: "35 dias",
      location: "Cabreúva - SP",
      scope: "Adequação de prumadas e tubulações de incêndio, substituição de fiação antiga de cobre, reorganização de quadros de distribuição elétrica de disjuntores e teste de carga.",
      before: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const formattedDbProjects = dbProjects.map(p => ({
    title: p.titulo,
    category: p.categoria,
    company: "1001 Obra",
    date: new Date(p.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    metragem: p.metragem || "Sob medida",
    duration: p.tempoExecucao || "No prazo",
    location: p.localizacao,
    scope: p.escopo || "Execução completa com acompanhamento técnico e certificação NBR.",
    before: p.imagemAntes,
    after: p.imagemDepois
  }));

  const allProjects = [...formattedDbProjects, ...portfolioProjects];

  const filteredProjects = selectedCategory === 'Todos' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory);

  return (
    <>
      <Header />

      {/* Main Hero */}
      <section className="section animate-fade-in" style={{
        background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '80px',
        position: 'relative'
      }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              Engenharia e Reformas de <span style={{ color: 'var(--accent-color)' }}>Alto Padrão</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.6 }}>
              A **1001 Obra** centraliza toda a gestão da sua reforma ou construção. Executamos com rapidez, acompanhamento de engenheiros dedicados e entrega pontual certificada.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                type="button" 
                onClick={() => handleOpenLeadModal({ assunto: 'Contato Geral Home', descricao: 'Interesse em agendar avaliação técnica' })}
                className="btn-primary"
              >
                Falar com Engenheiro
              </button>
              <a href="#calculadora" className="btn-secondary">Simular Orçamento</a>
            </div>
          </div>
          <div>
            <BeforeAfterSlider 
              beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
              height="380px"
            />
          </div>
        </div>
      </section>

      {/* Modern Stats / Contadores Dinâmicos */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '36px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {/* Stat 1 */}
            <div className="glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)'
            }}>
              <div style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-color)',
                padding: '14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HardHat size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  <span style={{ color: 'var(--accent-color)' }}>
                    <Counter end={480} prefix="+" />
                  </span>
                </h3>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Obras & Reformas Entregues
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)'
            }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  <span>
                    <Counter end={1200} prefix="+" />
                  </span>
                </h3>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Profissionais Habilitados
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)'
            }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                padding: '14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  <span>
                    <Counter end={150} prefix="+" />
                  </span>
                </h3>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Empresas & Condomínios Atendidos
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)'
            }}>
              <div style={{
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                padding: '14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  <span>
                    <Counter end={100} suffix="%" />
                  </span>
                </h3>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Garantia & Emissão de ART NBR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="servicos" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Especialidades da 1001 Obra</h2>
          <p className="section-subtitle">Soluções integradas com suporte de engenharia, garantia de entrega e conformidade NBR.</p>
          
          <div className="grid-2">
            {servicesList.map((service, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>{service.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
                    {service.desc}
                  </p>
                </div>
                <a href={`/locais/${service.slug}/${currentCidade}/${currentBairro}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent-color)',
                  fontWeight: 700
                }}>
                  Ver Detalhes do Local <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner / Highlight Section: Pedreiro para Reformas */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, var(--bg-tertiary) 50%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '70px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-glow)',
              color: 'var(--accent-color)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              <HardHat size={16} /> Especialidade em Destaque
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px' }}>
              Pedreiro para Reformas de <span style={{ color: 'var(--accent-color)' }}>Alto Padrão</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Demolição técnica controlada, nivelamento a laser de pisos e paredes, impermeabilização com garantia e assentamento perfeito de porcelanatos em grandes formatos. Reforma sem trauma e sem surpresas no orçamento.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                <Shield size={18} color="var(--accent-color)" /> Garantia de Entrega no Prazo
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                <Star size={18} color="var(--accent-color)" /> Equipes Próprias Especializadas
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                <Award size={18} color="var(--accent-color)" /> Emissão de ART e Laudo NBR
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#10b981" /> Descarte Ecológico de Entulho
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link 
                to="/pedreiro-para-reformas" 
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem', textDecoration: 'none' }}
              >
                Conhecer Serviço de Pedreiro <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => handleOpenLeadModal({ assunto: 'Pedreiro para Reformas de Alto Padrão', descricao: 'Interesse em agendar avaliação para pedreiro de reforma' })}
                className="btn-secondary"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                Solicitar Visita Técnica
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{
              padding: '12px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xl)',
              background: 'var(--bg-secondary)'
            }}>
              <BeforeAfterSlider 
                beforeImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop"
                afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                height="340px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Portfolio Section */}
      <section className="section" id="portfolio" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title">Obras Concluídas pela 1001 Obra</h2>
          <p className="section-subtitle">Confira as especificações técnicas, prazos de execução, fotos do local antes/depois e detalhes estruturais das nossas reformas.</p>

          {/* Filtros */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
            {['Todos', 'Residencial', 'Comercial', 'Predial'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                  color: selectedCategory === cat ? '#000' : 'var(--text-secondary)',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat ? 'var(--shadow-md)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Projetos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {filteredProjects.map((project, index) => (
              <div key={index} className="glass-card grid-2 animate-fade-in" style={{ alignItems: 'center', padding: '32px', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                {/* Imagem do Slider antes/depois */}
                <div>
                  <BeforeAfterSlider 
                    beforeImage={project.before}
                    afterImage={project.after}
                    height="320px"
                  />
                </div>
                {/* Detalhes Técnicos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: 'var(--accent-glow)',
                      color: 'var(--accent-color)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase'
                    }}>{project.category}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Responsável:</strong> {project.company}</span>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>{project.scope}</p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '20px',
                    fontSize: '0.875rem'
                  }}>
                    <div><strong>📍 Localização:</strong> {project.location}</div>
                    <div><strong>⏱️ Tempo de Obra:</strong> {project.duration}</div>
                    <div><strong>📐 Metragem:</strong> {project.metragem}</div>
                    <div><strong>📅 Conclusão:</strong> {project.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title">Orçamento Instantâneo</h2>
          <p className="section-subtitle">Ajuste os parâmetros abaixo e calcule a média de mão de obra e materiais para a sua região.</p>
          <Calculator onOpenLeadModal={handleOpenLeadModal} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 className="section-title">Depoimentos dos Clientes</h2>
          <p className="section-subtitle">Quem já reformou com a 1001 Obra aprova nosso método e controle rígido de prazos.</p>
          
          <div className="grid-3">
            {[
              { nome: "Rodrigo Silva", cargo: "Síndico Condomínio Plaza", texto: "A reforma de fachada foi executada exatamente no prazo acordado. O controle de ART e as vistorias semanais do engenheiro nos deram total tranquilidade." },
              { nome: "Fernanda Lemos", cargo: "Arquiteta Associada", texto: "Sempre indico a 1001 para a execução dos meus projetos de gesso e pintura. O acabamento premium que entregam valoriza muito meu trabalho." },
              { nome: "Julio Cesar", cargo: "Proprietário Comercial", texto: "Excelente trabalho com drywall e infraestrutura elétrica na nova loja. Limpeza impecável durante toda a obra." }
            ].map((review, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent-color)" color="var(--accent-color)" />)}
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  "{review.texto}"
                </p>
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{review.nome}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.cargo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        leadData={activeLeadData} 
      />
      <Footer />
    </>
  );
};

export default Home;
