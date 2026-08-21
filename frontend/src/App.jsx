import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import SEOPageTemplate from './components/SEOPageTemplate';
import TrabalheConosco from './components/TrabalheConosco';
import SolicitarServico from './components/SolicitarServico';
import PainelProfissional from './components/PainelProfissional';
import PedreiroParaReformas from './components/PedreiroParaReformas';

import { API_URL } from './config';

// Subcomponente para aplicar metatags de SEO Global
function GlobalSEOHelper() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Aplica apenas em rotas normais que não sejam de SEO local específico (que tem seu próprio template)
    if (!pathname.startsWith('/locais/')) {
      const fetchGlobalSEO = async () => {
        try {
          const res = await fetch(`${API_URL}/settings`);
          if (res.ok) {
            const data = await res.json();
            
            // Meta Title
            document.title = data.metaTitulo || '1001 Obra - Engenharia e Reformas em SP';

            // Meta Description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.metaDescricao || 'Empresa especializada em engenharia, reformas e manutenção predial em SP.';

            // Meta Keywords
            let metaKeys = document.querySelector('meta[name="keywords"]');
            if (!metaKeys) {
              metaKeys = document.createElement('meta');
              metaKeys.name = 'keywords';
              document.head.appendChild(metaKeys);
            }
            metaKeys.content = data.metaPalavrasChave || 'reformas, engenharia, pedreiro, drywall, pintura';

            // Open Graph Title & Description for Google/Social Sharing
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
              ogTitle = document.createElement('meta');
              ogTitle.setAttribute('property', 'og:title');
              document.head.appendChild(ogTitle);
            }
            ogTitle.content = data.metaTitulo;

            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (!ogDesc) {
              ogDesc = document.createElement('meta');
              ogDesc.setAttribute('property', 'og:description');
              document.head.appendChild(ogDesc);
            }
            ogDesc.content = data.metaDescricao;

            let ogImg = document.querySelector('meta[property="og:image"]');
            if (!ogImg) {
              ogImg = document.createElement('meta');
              ogImg.setAttribute('property', 'og:image');
              document.head.appendChild(ogImg);
            }
            ogImg.content = data.ogImage;
          }
        } catch (err) {
          console.warn('Erro ao carregar SEO global:', err);
        }
      };
      fetchGlobalSEO();
    }
  }, [pathname]);

  return null;
}

// Subcomponente para escutar a mudança do hash na rota e fazer scroll suave
function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return null;
}

function App() {
  return (
    <Router basename="/obra">
      <GlobalSEOHelper />
      <ScrollToHash />
      <Routes>
        {/* Rota Principal */}
        <Route path="/" element={<Home />} />
        
        {/* Painel de Controle */}
        <Route path="/admin" element={<Admin />} />

        {/* Cadastro Trabalhe Conosco */}
        <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />

        {/* Solicitação de Serviços (Estilo Uber) */}
        <Route path="/chamar-profissional" element={<SolicitarServico />} />

        {/* Painel dos Profissionais para aceitar chamados */}
        <Route path="/painel-profissional" element={<PainelProfissional />} />

        {/* Página Especializada: Pedreiro para Reformas */}
        <Route path="/pedreiro-para-reformas" element={<PedreiroParaReformas />} />
        
        {/* Páginas Dinâmicas de SEO Local */}
        <Route path="/locais/:servicoSlug/:cidadeSlug/:bairroSlug" element={<SEOPageTemplate />} />
        <Route path="/locais/:servicoSlug/:cidadeSlug" element={<SEOPageTemplate />} />
      </Routes>
      
      {/* Botão Flutuante do WhatsApp */}
      <a 
        href="https://wa.me/5511965111670" 
        target="_blank" 
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#25d366',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
        title="Fale conosco no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style={{ color: '#fff' }}>
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.18-1.358a9.92 9.92 0 0 0 4.83 1.258h.005c5.507 0 9.99-4.478 9.99-9.984 0-2.667-1.037-5.176-2.923-7.062C17.197 3.037 14.686 2 12.012 2zm0 17.06h-.003a8.136 8.136 0 0 1-4.153-1.144l-.298-.177-3.087.81.825-3.01-.194-.309a8.145 8.145 0 0 1-1.246-4.246c0-4.503 3.669-8.167 8.167-8.167 2.181 0 4.233.85 5.776 2.396 1.543 1.545 2.392 3.6 2.39 5.78-.002 4.504-3.67 8.167-8.168 8.167zm4.479-6.113c-.245-.122-1.454-.717-1.68-.8-.225-.084-.389-.122-.553.123-.163.245-.633.8-.776.963-.142.163-.285.183-.53.061-.244-.122-1.03-.379-1.961-1.21-.725-.647-1.215-1.446-1.357-1.69-.143-.245-.015-.377.108-.498.11-.11.245-.286.367-.429.123-.143.164-.245.246-.409.082-.163.04-.306-.02-.429-.062-.122-.553-1.33-.757-1.821-.199-.48-.401-.415-.552-.423-.14-.007-.306-.008-.471-.008-.165 0-.434.062-.661.306-.228.245-.87.85-.87 2.075 0 1.226.892 2.41 1.013 2.574.122.163 1.756 2.68 4.253 3.757.595.256 1.059.41 1.422.525.597.19 1.14.163 1.569.099.479-.071 1.455-.593 1.66-.167.204-.426.204-.793 0-.853z" />
        </svg>
      </a>
    </Router>
  );
}

export default App;
