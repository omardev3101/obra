import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Calculator from './Calculator';
import LeadModal from './LeadModal';
import BeforeAfterSlider from './BeforeAfterSlider';
import { CheckCircle2, ShieldCheck, Award, FileSpreadsheet, ChevronDown, HelpCircle } from 'lucide-react';
import Footer from './Footer';

const SEOPageTemplate = () => {
  const { servicoSlug, cidadeSlug, bairroSlug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLeadData, setActiveLeadData] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const SERVICE_IMAGES = {
    'construcao-de-paredes': {
      before: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop", // Obra em tijolo/concreto aparente sem acabamento
      after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"  // Parede acabada moderna
    },
    'fundacoes-e-vigas': {
      before: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", // Escavação e ferragens de fundação
      after: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"  // Estrutura pronta e limpa
    },
    'demolicao-tecnica': {
      before: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop", // Estrutura antiga sendo removida
      after: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"  // Espaço limpo e reformado
    },
    'pintura-interna-externa': {
      before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", // Parede descascada com infiltração
      after: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop"  // Pintura aveludada impecável
    },
    'aplicacao-de-porcelanato': {
      before: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop", // Contrapiso de concreto em obras
      after: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"  // Piso de porcelanato polido
    },
    'massa-corrida-e-texturas': {
      before: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop", // Reboco cru e rústico
      after: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop"  // Parede com massa corrida lisa
    },
    'instalacoes-eletricas': {
      before: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=800&auto=format&fit=crop", // Fiação exposta e quadro antigo
      after: "https://images.unsplash.com/photo-1565538810844-1e119fa1802b?q=80&w=800&auto=format&fit=crop"  // Iluminação moderna embutida
    },
    'rede-hidraulica-e-esgoto': {
      before: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop", // Encanamento antigo e infiltração
      after: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"  // Banheiro/Cozinha reformados
    },
    'sistemas-de-incendio': {
      before: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=800&auto=format&fit=crop", // Tubulação antiga predial
      after: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"  // Tubulação hidráulica de incêndio pintada e segura
    },
    'forro-de-gesso-rebaixado': {
      before: "https://images.unsplash.com/photo-1505798577917-a65157d44f9e?q=80&w=800&auto=format&fit=crop", // Teto de laje de concreto bruta
      after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"  // Teto de gesso rebaixado com LED
    },
    'paredes-em-drywall': {
      before: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop", // Perfilado metálico de drywall em montagem
      after: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"  // Divisória instalada e pintada
    },
    'sancas-decorativas': {
      before: "https://images.unsplash.com/photo-1505798577917-a65157d44f9e?q=80&w=800&auto=format&fit=crop", // Teto reto simples sem detalhes
      after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"  // Sanca iluminada premium
    }
  };

  const defaultImages = SERVICE_IMAGES[servicoSlug] || {
    before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  };

  const images = {
    before: pageData?.imagemAntes || defaultImages.before,
    after: pageData?.imagemDepois || defaultImages.after
  };

  const formatWord = (slug) => {
    if (!slug) return '';
    const lowerWords = ['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'com', 'para', 'a', 'o'];
    return slug.split('-').map(w => {
      if (lowerWords.includes(w.toLowerCase())) {
        return w.toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  };

  const bairro = formatWord(bairroSlug || 'centro');
  const cidade = formatWord(cidadeSlug || 'cabreuva');
  const servico = formatWord(servicoSlug || 'manutencao-predial');

  useEffect(() => {
    const fetchSEOData = async () => {
      setLoading(true);
      try {
        const bParam = bairroSlug ? `/${bairroSlug}` : '';
        const response = await fetch(`http://localhost:3000/api/seo/${servicoSlug}/${cidadeSlug}${bParam}`);
        if (!response.ok) throw new Error('Falha ao buscar SEO local');
        const data = await response.json();
        setPageData(data);
        document.title = data.tituloSEO;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.descricaoSEO);
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do SEO:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [servicoSlug, cidadeSlug, bairroSlug]);

  const handleOpenLeadModal = (data) => {
    setActiveLeadData(data);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>
        <h3>Carregando localizador dinâmico de serviços...</h3>
      </div>
    );
  }

  const data = pageData || {
    tituloSEO: `${servico} em ${cidade} | 1001 Obra`,
    conteudoH1: `${servico} em ${cidade}`,
    textoPersonalizado: `Procurando por ${servico} de alta performance em ${cidade}? A equipe da 1001 Obra é referência em serviços rápidos, seguros e eficientes, garantindo a conformidade NBR para sua edificação.`,
    servico,
    cidade
  };

  const formatSlug = (str) => str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  const cSlug = formatSlug(data.cidade || 'cabreuva');

  // Subseções estruturadas para o SEO local de manutenção predial e reformas
  const subSections = [
    {
      title: `Manutenção Elétrica e Hidráulica em ${data.cidade}`,
      slug: "instalacoes-eletricas",
      desc: `As instalações elétricas e hidráulicas são o coração de qualquer edificação. Um sistema mal cuidado em ${data.cidade} pode causar desde pequenos incômodos até grandes acidentes. Nossos serviços incluem a inspeção de fiações, quadros de distribuição, disjuntores e vazamentos hidráulicos complexos, prevenindo infiltrações e desperdício de água.`
    },
    {
      title: `Reforma e Reparos Estruturais em ${data.cidade}`,
      slug: "fundacoes-e-vigas",
      desc: `A estrutura e os acabamentos do seu imóvel sofrem com a ação do tempo. Em ${data.cidade}, nossa equipe especializada lida com trincas em paredes, infiltrações, problemas em telhados e impermeabilização de fachadas, preservando o valor patrimonial e a segurança da sua edificação.`
    },
    {
      title: `Manutenção de Áreas Comuns e Externas em ${data.cidade}`,
      slug: "manutencao-predial-pmoc",
      desc: `Em condomínios e empresas de ${data.cidade}, a conservação das áreas comuns é crucial para o bem-estar e valorização. Atuamos com limpeza técnica de fachadas, desentupimento de calhas, manutenção de esquadrias e reparos em áreas de lazer para que o espaço esteja sempre impecável e seguro.`
    },
    {
      title: `Planejamento e Acompanhamento Técnico em ${data.cidade}`,
      slug: "emissao-de-art",
      desc: `A melhor maneira de gerenciar a manutenção do seu prédio em ${data.cidade} é com um plano detalhado acompanhado por engenheiros. Elaboramos planos de manutenção preventiva personalizados, cronogramas de vistorias técnicas periódicas e emissão de laudo técnico (ART), trazendo total conformidade de segurança.`
    }
  ];

  // FAQs estruturadas e personalizadas dinamicamente
  const faqs = [
    {
      q: `O que é a manutenção predial e qual a sua importância em ${data.cidade}?`,
      a: `A manutenção predial é o conjunto de serviços que visa conservar a segurança, funcionalidade e valorização do imóvel. Em ${data.cidade}, ela previne problemas estruturais graves, reduz custos corretivos a longo prazo e assegura a tranquilidade de moradores e trabalhadores.`
    },
    {
      q: "Qual a diferença entre manutenção preventiva e corretiva?",
      a: "A manutenção preventiva é feita de forma programada antes de problemas aparecerem (ex: inspeções, limpeza de calhas). A corretiva conserta danos que já aconteceram (ex: vazamentos repentinos ou disjuntores queimados). A preventiva é mais econômica e evita riscos e paralisações indesejadas."
    },
    {
      q: `Como solicitar uma vistoria ou orçamento gratuito para meu prédio em ${data.cidade}?`,
      a: `Basta preencher o formulário de simulação no nosso site ou entrar em contato direto pelo WhatsApp. Nós agendamos uma visita técnica sem compromisso de nossos engenheiros em ${data.cidade} para mapear as necessidades da sua edificação.`
    },
    {
      q: "A 1001 Obra emite laudo técnico e ART?",
      a: "Sim, todos os nossos projetos e vistorias contam com acompanhamento técnico direto de engenheiros civis habilitados e emissão da respectiva ART (Anotação de Responsabilidade Técnica), essencial para aprovações em condomínios conforme a norma NBR 16280."
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="section" style={{
        background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 90%)',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '60px'
      }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--accent-glow)',
              color: 'var(--accent-color)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.875rem',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={16} /> Engenharia Certificada NBR
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
              {data.conteudoH1}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
              {data.textoPersonalizado}
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                type="button" 
                onClick={() => handleOpenLeadModal({
                  assunto: `${data.servico} - ${data.cidade}`,
                  descricao: `Interesse em ${data.servico} em ${data.cidade}`
                })}
                className="btn-primary"
              >
                Solicitar Visita Técnica Gratuita
              </button>
              <a href="#calculadora" className="btn-secondary">Simular Orçamento</a>
            </div>
          </div>

          <div>
            <BeforeAfterSlider 
              beforeImage={images.before}
              afterImage={images.after}
              height="350px"
            />
          </div>
        </div>
      </section>

      {/* Trust Factors / NBR Standards */}
      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '50px 0' }}>
        <div className="container grid-3">
          <div style={{ display: 'flex', gap: '16px' }}>
            <Award size={40} color="var(--accent-color)" />
            <div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Emissão de ART</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Todos os nossos serviços de alvenaria, drywall e sistemas contam com laudo técnico e Anotação de Responsabilidade Técnica (ART).
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <ShieldCheck size={40} color="var(--accent-color)" />
            <div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Norma NBR 16280</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Atuação em estrito cumprimento às normas de reformas em condomínios edilícios, garantindo segurança estrutural completa.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <FileSpreadsheet size={40} color="var(--accent-color)" />
            <div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Orçamento Transparente</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Detalhamento exato de materiais e mão de obra, sem surpresas ou taxas ocultas ao longo da execução do cronograma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 className="section-title">Especialidades em {data.cidade}</h2>
          <p className="section-subtitle">Confira detalhadamente nossa abordagem estratégica para a conservação e valorização predial do seu imóvel.</p>
          
          <div className="grid-2" style={{ gap: '24px', marginTop: '40px' }}>
            {subSections.map((sec, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>{sec.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>{sec.desc}</p>
                </div>
                <a 
                  href={`/locais/${sec.slug}/${cSlug}`} 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-color)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    marginTop: '8px'
                  }}
                >
                  Ver Detalhes do Serviço →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title">Perguntas Frequentes</h2>
          <p className="section-subtitle">Esclareça suas dúvidas técnicas principais sobre a manutenção predial em sua região.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '40px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  padding: '16px 20px', 
                  border: '1px solid var(--border-color)', 
                  cursor: 'pointer',
                  borderRadius: '12px'
                }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="var(--accent-color)" />
                    {faq.q}
                  </h3>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </div>
                {activeFaq === idx && (
                  <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Integration */}
      <section className="section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title">Calcule os Custos do Projeto</h2>
          <p className="section-subtitle">
            Simule instantaneamente o valor estimado para {data.servico} em {data.cidade}.
          </p>
          <Calculator onOpenLeadModal={handleOpenLeadModal} />
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

export default SEOPageTemplate;
