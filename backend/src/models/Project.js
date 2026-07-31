const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM('Residencial', 'Comercial', 'Predial', 'Condominial'),
    allowNull: false
  },
  localizacao: {
    type: DataTypes.STRING,
    allowNull: false // ex: "Cabreuva, SP"
  },
  metragem: {
    type: DataTypes.STRING,
    allowNull: true // ex: "250 m²"
  },
  tempoExecucao: {
    type: DataTypes.STRING,
    allowNull: true // ex: "3 semanas"
  },
  imagemAntes: {
    type: DataTypes.TEXT,
    allowNull: true // Caminho, URL ou base64 da imagem do "Antes"
  },
  imagemDepois: {
    type: DataTypes.TEXT,
    allowNull: true // Caminho, URL ou base64 da imagem do "Depois"
  },
  escopo: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Project;
