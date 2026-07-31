const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SEOPage = sequelize.define('SEOPage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  servico: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Manutenção Predial"
  },
  servicoSlug: {
    type: DataTypes.STRING,
    allowNull: false // ex: "manutencao-predial"
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Cabreúva"
  },
  cidadeSlug: {
    type: DataTypes.STRING,
    allowNull: false // ex: "cabreuva"
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Centro"
  },
  bairroSlug: {
    type: DataTypes.STRING,
    allowNull: false // ex: "centro"
  },
  tituloSEO: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Manutenção Predial Centro, Cabreúva | 1001 Obra"
  },
  descricaoSEO: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conteudoH1: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Manutenção Predial de Alta Performance em Cabreúva"
  },
  textoPersonalizado: {
    type: DataTypes.TEXT,
    allowNull: true // Seção de texto detalhado com palavras-chave locais
  },
  imagemAntes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagemDepois: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['servicoSlug', 'cidadeSlug', 'bairroSlug']
    }
  ]
});

module.exports = SEOPage;
