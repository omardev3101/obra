const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clienteNome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clienteTelefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  servicoSelecionado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Buscando', 'Aceito', 'Em Caminho', 'Finalizado', 'Cancelado'),
    defaultValue: 'Buscando',
    allowNull: false
  },
  precoEstimado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxaIntermediacao: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  multiplicadorDinamico: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.00,
    allowNull: false
  },
  profissionalId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  metragem: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  tipoPreco: {
    type: DataTypes.ENUM('Diária', 'Preço Fechado'),
    defaultValue: 'Preço Fechado',
    allowNull: false
  },
  quantidadeDias: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true
  },
  fotosVideos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Novos campos para Justificativa de cancelamento e Adicionais
  justificativaCancelamento: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precoAdicional: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  justificativaAdicional: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aprovadoAdicional: {
    type: DataTypes.ENUM('Nenhum', 'Pendente', 'Aprovado', 'Recusado'),
    defaultValue: 'Nenhum',
    allowNull: false
  }
});

module.exports = ServiceRequest;
