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
  cep: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  raioKm: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    allowNull: false
  },
  fotoUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experiencia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Aprovado', 'Reprovado'),
    defaultValue: 'Pendente',
    allowNull: false
  },
  aceitouTermos: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  dataAceiteTermos: {
    type: DataTypes.DATE,
    allowNull: true
  },
  percentualDescontoAcordado: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 15.00,
    allowNull: true
  }
});

module.exports = Professional;
