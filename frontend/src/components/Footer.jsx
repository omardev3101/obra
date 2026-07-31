import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    nomeEmpresa: '1001 OBRA',
    logoUrl: '/logo.png',
    telefone: '(11) 96511-1670',
    whatsapp: '5511965111670',
    email: 'contato@1001obra.com.br',
    horarioFuncionamento: 'Seg a Sáb: 08:00 às 18:00',
    endereco: 'Atendimento em todo o Estado de SP',
    instagram: 'https://instagram.com/1001obra',
    facebook: 'https://facebook.com/1001obra',
    linkedin: 'https://linkedin.com/company/1001obra',
    youtube: 'https://youtube.com/@1001obra'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar configurações no Footer:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glass-panel" style={{
      borderTop: '1px solid var(--border-color)',
      padding: '60px 0 30px 0',
      background: 'var(--bg-secondary)',
      marginTop: 'auto'
    }}>
      <div className="container grid-4" style={{ gap: '40px', marginBottom: '40px' }}>
        {/* Coluna 1: Sobre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={(settings.logoUrl && settings.logoUrl !== '/logo.png') ? settings.logoUrl : "/obra/logo.png"} 
              alt={`${settings.nomeEmpresa} Logo`} 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '2px solid var(--accent-color)'
              }} 
            />
            <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>{settings.nomeEmpresa || '1001 OBRA'}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Nossa missão é transformar sua visão em realidade. Com uma equipe dedicada de engenheiros e técnicos, trabalhamos com excelência em cada projeto de reforma, construção e manutenção predial.
          </p>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" title="Instagram" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" title="Facebook" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" title="YouTube" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Coluna 2: Fale Conosco */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-color)', letterSpacing: '0.5px' }}>
            Fale Conosco
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="var(--accent-color)" />
              <span>{settings.email}</span>
            </a>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="var(--accent-color)" />
              <span>{settings.telefone}</span>
            </a>
          </div>
        </div>

        {/* Coluna 3: Horário de Funcionamento */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-color)', letterSpacing: '0.5px' }}>
            Horário de Funcionamento
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--accent-color)" />
              <span>{settings.horarioFuncionamento}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              📍 {settings.endereco}
            </div>
          </div>
        </div>

        {/* Coluna 4: Links Úteis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-color)', letterSpacing: '0.5px' }}>
            Links Úteis
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/" onClick={handleScrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Home <ArrowUpRight size={12} /></Link></li>
            <li><Link to="/pedreiro-para-reformas">Pedreiro para Reformas</Link></li>
            <li><Link to="/#portfolio">Sobre Nós</Link></li>
            <li><Link to="/#servicos">Serviços</Link></li>
            <li><Link to="/chamar-profissional">Chamar Profissional</Link></li>
            <li><Link to="/trabalhe-conosco">Trabalhe Conosco</Link></li>
            <li><Link to="/painel-profissional">Painel do Parceiro</Link></li>
            <li><a href="https://wa.me/5511965111670" target="_blank" rel="noreferrer">Contato</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <span>© 1001 Obra - Copyright {currentYear}</span>
        <button onClick={handleScrollToTop} style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
