const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const ServiceRequest = require('./ServiceRequest');

const ServiceStep = sequelize.define('ServiceStep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  serviceRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Em Andamento', 'Concluido'),
    defaultValue: 'Pendente',
    allowNull: false
  },
  fotoComprovante: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observacaoCampo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataConclusao: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

ServiceStep.belongsTo(ServiceRequest, { foreignKey: 'serviceRequestId' });
ServiceRequest.hasMany(ServiceStep, { foreignKey: 'serviceRequestId', as: 'steps' });

module.exports = ServiceStep;
