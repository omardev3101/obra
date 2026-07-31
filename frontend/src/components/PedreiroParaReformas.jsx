import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import BeforeAfterSlider from './BeforeAfterSlider';
import LeadModal from './LeadModal';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  HardHat, 
  Clock, 
  Award, 
  CreditCard, 
  HelpCircle,
  Wrench,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

const PedreiroParaReformas = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [customLoc, setCustomLoc] = useState('São Paulo - SP');

  useEffect(() => {
    document.title = 'Pedreiro para Reformas de Alto Padrão | 1001 Obra';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const storedLoc = localStorage.getItem('custom_location');
    if (storedLoc) {
      setCustomLoc(storedLoc);
    }
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "1. Posso reformar meu apartamento sem sair dele?",
      a: "Sim, é totalmente possível. Nossas equipes são altamente treinadas para isolar as áreas em reforma, minimizando a proliferação de pó e ruídos, mantendo uma rotina de limpeza rigorosa para que a convivência seja a mais tranquila possível durante a obra."
    },
    {
      q: "2. Como é feito o descarte dos entulhos da reforma?",
      a: "Nós cuidamos de todo o processo. Contratamos caçambas licenciadas e garantimos que todo o entulho seja destinado a aterros de resíduos da construção civil devidamente autorizados, respeitando rigorosamente as normas ambientais."
    },
    {
      q: "3. A 1001 Obra faz o projeto da reforma também?",
      a: "Focamos na execução técnica de excelência. Caso você já possua um projeto arquitetônico, nós o seguimos fielmente. Se precisar de um projeto, podemos indicar parceiros projetistas ou trabalhar em conjunto com o profissional da sua preferência."
    },
    {
      q: "4. Quanto custa o metro quadrado de um pedreiro para reforma?",
      a: "O valor varia conforme a complexidade da intervenção (se envolve demolição técnica, impermeabilização avançada, acabamentos finos de grandes formatos, etc.). Por isso, realizamos orçamentos personalizados e transparentes."
    },
    {
      q: "5. Vocês oferecem garantia contra infiltrações após a reforma?",
      a: "Sim! Quando executamos o serviço completo de impermeabilização em banheiros, cozinhas ou áreas externas, oferecemos garantia contratual completa sobre o serviço, assegurando que o problema não retorne."
    },
    {
      q: "6. Como garantir que a reforma termine rigorosamente no prazo?",
      a: "Trabalhamos com um cronograma detalhado por etapas. Qualquer necessidade de ajuste técnico é comunicada imediatamente com a devida solução, garantindo que o fluxo de trabalho não seja interrompido."
    },
    {
      q: "7. Vocês atendem reformas em condomínios residenciais e comerciais?",
      a: "Absolutamente. Estamos totalmente habituados com as rigorosas normas de horários, isolamento térmico e acústico e segurança de condomínios, garantindo que a gestão e os vizinhos fiquem tranquilos."
    },
    {
      q: "8. Qual a diferença entre reforma estética e reforma estrutural?",
      a: "A reforma estética foca em troca de revestimentos, pintura e iluminação. A estrutural envolve reforços, abertura de vãos ou mudanças em alvenarias. A 1001 Obra está qualificada para executar ambas com total acompanhamento de engenharia."
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="section animate-fade-in" style={{
        background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'var(--accent-glow)',
              color: 'var(--accent-color)',
              padding: '6px 14px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Especialistas em Alvenaria & Acabamentos
            </span>
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginTop: '16px', marginBottom: '20px' }}>
              Especialistas em Pedreiro para <span style={{ color: 'var(--accent-color)' }}>Reformas de Alto Padrão</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
              Transformando ambientes com qualidade, agilidade e precisão. Atendimento técnico especializado em <strong>{customLoc}</strong> com garantia e emissão de ART.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setModalOpen(true)}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <PhoneCall size={18} /> Falar com Consultor de Reformas
              </button>
              <a 
                href="#metodologia" 
                className="btn-secondary"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                Conhecer Metodologia
              </a>
            </div>
          </div>

          <div>
            <BeforeAfterSlider 
              beforeImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
              height="380px"
            />
          </div>
        </div>
      </section>

      {/* Introdução Detalhada */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
            Pedreiro para Reformas: Transformando Ambientes com Qualidade, Agilidade e Precisão
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '20px' }}>
            Contratar um pedreiro para reformas é um passo decisivo para quem busca renovar seu imóvel, seja ele residencial ou comercial, com a segurança de um resultado duradouro e esteticamente impecável. Na <strong>1001 Obra</strong>, compreendemos que reformar é muito mais do que apenas mudar revestimentos ou derrubar paredes; trata-se de atualizar o conforto, a funcionalidade e o valor de mercado de um patrimônio. Nossa equipe de pedreiros especializados em reformas é treinada para atuar em ambientes já existentes, lidando com os desafios específicos de integrações estruturais, ajustes de prumo e atualizações técnicas necessárias em obras de modernização.
          </p>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Um pedreiro focado em reformas possui uma sensibilidade técnica diferente de quem atua apenas em construções novas. Ele precisa entender de demolição controlada, proteção de áreas não reformadas e, principalmente, de como compatibilizar novos materiais com estruturas antigas. Na 1001 Obra, priorizamos a organização absoluta e o cumprimento de prazos, pois sabemos o quanto uma obra pode impactar a rotina de uma família ou o funcionamento de um negócio. Nossos profissionais são especialistas em transformar o antigo no novo com maestria, garantindo que cada intervenção seja feita com o máximo de limpeza e o mínimo de transtorno possível.
          </p>
        </div>
      </section>

      {/* O que é o serviço */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>
              O que é o serviço de Pedreiro para Reformas?
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              O serviço de pedreiro para reformas abrange todas as intervenções de alvenaria e acabamento destinadas a modificar, restaurar ou ampliar um imóvel. Ao contrário da construção convencional, a reforma exige uma análise minuciosa de patologias existentes, como infiltrações, trincas ou irregularidades nas superfícies.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Na <strong>1001 Obra</strong>, o conceito envolve uma gama multidisciplinar: remoção de azulejos antigos sem danificar a tubulação, correção de umidade em paredes de rodapé, nivelamento de tetos para receber gesso, abertura de vãos para novos conceitos de iluminação e modernização de fachadas. Utilizamos detectores de tubulação para evitar acidentes durante as intervenções, trazendo uma camada de segurança tecnológica que é o diferencial da nossa marca.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '30px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
              <Sparkles size={20} /> Diferenciais Técnicos
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 color="#10b981" size={18} /> Demolição técnica com controle de poeira</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 color="#10b981" size={18} /> Nivelamento a laser de contrapisos e paredes</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 color="#10b981" size={18} /> Assentamento de porcelanatos em grandes formatos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 color="#10b981" size={18} /> Impermeabilização técnica com garantia estendida</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Metodologia de Execução */}
      <section className="section" id="metodologia" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '12px' }}>
            Como Funciona o Serviço na 1001 Obra
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Nossa metodologia para reformas é rigorosa e focada na satisfação do cliente.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { num: "01", title: "Visita de Diagnóstico", desc: "Avaliamos o estado atual do imóvel para identificar necessidades estruturais ocultas e as expectativas estéticas do cliente." },
              { num: "02", title: "Proteção do Ambiente", desc: "Antes de qualquer intervenção, protegemos pisos, móveis e áreas comuns (como elevadores) com materiais específicos." },
              { num: "03", title: "Demolição Técnica", desc: "Retirada de elementos antigos de forma controlada, separando o entulho para descarte ecológico imediato." },
              { num: "04", title: "Alvenaria e Reparos", desc: "Levantamos novas paredes, fechamos vãos ou corrigimos superfícies com argamassas de alta performance." },
              { num: "05", title: "Preparação Fina", desc: "Nivelamento e prumo perfeitos, garantindo que o acabamento final seja impecável." },
              { num: "06", title: "Limpeza Pós-Obra", desc: "Finalizamos rejuntes e limpeza técnica fina, entregando o ambiente pronto para morar ou decorar." }
            ].map((step, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-color)' }}>{step.num}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '8px 0' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '40px' }}>
            Benefícios de Contratar Nossos Pedreiros para Reformas
          </h2>

          <div className="grid-3" style={{ gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <ShieldCheck size={32} color="var(--accent-color)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Redução de Erros e Desperdício</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Especialistas sabem exatamente onde e como intervir, evitando danos a tubulações e perdas de material caro.</p>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <Clock size={32} color="var(--accent-color)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Agilidade na Execução</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Equipes treinadas para trabalhar com cronogramas apertados, ideais para reformas residenciais e comerciais.</p>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <Award size={32} color="var(--accent-color)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Qualidade Estética Superior</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Acabamentos nivelados e esquadros perfeitos que fazem toda a diferença na valorização visual do imóvel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pagamento Facilitado Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '40px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard color="var(--accent-color)" /> Pagamento Facilitado
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Parcelamento em até 12x no cartão de crédito, faturamento para empresas e desconto exclusivo no PIX.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setModalOpen(true)}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            Solicitar Orçamento Transparente
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <HelpCircle color="var(--accent-color)" /> Perguntas Frequentes (FAQ)
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Tire todas as suas dúvidas sobre o serviço de pedreiro para reformas da 1001 Obra.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  padding: '18px 24px', 
                  cursor: 'pointer', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px'
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{faq.q}</h3>
                  {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {activeFaq === idx && (
                  <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
            Pronto para Transformar seu Imóvel sem Trauma?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '28px' }}>
            Sua casa ou negócio merece uma renovação com quem realmente entende do assunto. Não arrisque o seu patrimônio com curiosos.
          </p>
          <button 
            type="button" 
            onClick={() => setModalOpen(true)}
            className="btn-primary"
            style={{ padding: '16px 36px', fontSize: '1.1rem', margin: '0 auto' }}
          >
            Falar com Consultor de Reformas <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <Footer />

      <LeadModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initialData={{ assunto: 'Pedreiro para Reformas de Alto Padrão', descricao: 'Solicitação de consulta para pedreiro de reforma' }}
      />
    </>
  );
};

export default PedreiroParaReformas;
