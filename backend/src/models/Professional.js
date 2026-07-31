const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Professional = sequelize.define('Professional', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  especialidade: {
    type: DataTypes.STRING, // ex: "Pedreiro", "Pintor", "Eletricista", "Gesseiro", "Mestre de Obras"
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experiencia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Aprovado', 'Reprovado'),
    defaultValue: 'Pendente',
    allowNull: false
  }
});

module.exports = Professional;
