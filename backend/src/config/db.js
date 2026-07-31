const { Sequelize } = require('sequelize');
const path = require('path');

// Carrega as variáveis de ambiente da raiz do projeto
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'obra',
  process.env.DB_USER || 'omar',
  process.env.DB_PASS || 'numseyMesmo',
  {
    host: process.env.DB_HOST || '187.45.255.59',
    dialect: 'postgres',
    logging: false, // desabilita logs SQL detalhados no console
    dialectOptions: {
      // Caso a VPS exija SSL, adicione as chaves aqui
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Conectado ao Banco de Dados e tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
