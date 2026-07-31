const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CompanySettings = sequelize.define('CompanySettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeEmpresa: {
    type: DataTypes.STRING,
    defaultValue: '1001 OBRA'
  },
  logoUrl: {
    type: DataTypes.TEXT,
    defaultValue: '/logo.png'
  },
  telefone: {
    type: DataTypes.STRING,
    defaultValue: '(11) 96511-1670'
  },
  whatsapp: {
    type: DataTypes.STRING,
    defaultValue: '5511965111670'
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: 'contato@1001obra.com.br'
  },
  horarioFuncionamento: {
    type: DataTypes.STRING,
    defaultValue: 'Seg a Sáb: 08:00 às 18:00'
  },
  endereco: {
    type: DataTypes.STRING,
    defaultValue: 'Atendimento em todo o Estado de SP'
  },
  instagram: {
    type: DataTypes.STRING,
    defaultValue: 'https://instagram.com/1001obra'
  },
  facebook: {
    type: DataTypes.STRING,
    defaultValue: 'https://facebook.com/1001obra'
  },
  linkedin: {
    type: DataTypes.STRING,
    defaultValue: 'https://linkedin.com/company/1001obra'
  },
  youtube: {
    type: DataTypes.STRING,
    defaultValue: 'https://youtube.com/@1001obra'
  },
  metaTitulo: {
    type: DataTypes.STRING,
    defaultValue: '1001 Obra - Engenharia, Reformas e Manutenção Predial em SP'
  },
  metaDescricao: {
    type: DataTypes.TEXT,
    defaultValue: 'Empresa especializada em engenharia, reformas residenciais e comerciais, manutenção predial, drywall, pintura e emissão de ART em todo o estado de São Paulo.'
  },
  metaPalavrasChave: {
    type: DataTypes.TEXT,
    defaultValue: 'reformas sp, engenharia civil, manutencao predial, drywall, pintura residencial, emissao de art, avcb, pedreiro sp'
  },
  ogImage: {
    type: DataTypes.TEXT,
    defaultValue: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop'
  }
});

module.exports = CompanySettings;
