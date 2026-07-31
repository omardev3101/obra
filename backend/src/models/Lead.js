const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Orçamento Pintura Centro" ou "Manutenção Predial"
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  calculadoraDados: {
    type: DataTypes.JSONB,
    allowNull: true // guarda dados da calculadora se houver (área, tipo de material, custo gerado)
  },
  origemUrl: {
    type: DataTypes.STRING,
    allowNull: true // URL onde o lead converteu
  },
  status: {
    type: DataTypes.ENUM('Novo', 'Em Atendimento', 'Convertido', 'Descartado'),
    defaultValue: 'Novo',
    allowNull: false
  }
});

module.exports = Lead;
