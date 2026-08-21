const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, sequelize } = require('./config/db');
const apiRoutes = require('./routes/api');

// Modelos para garantir que sejam registrados no Sequelize
const User = require('./models/User');
const SEOPage = require('./models/SEOPage');
const Lead = require('./models/Lead');
const Project = require('./models/Project');
const Professional = require('./models/Professional');
const ServiceRequest = require('./models/ServiceRequest');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas da API
app.use('/api', apiRoutes);

// Servir arquivos estáticos se necessário (por exemplo, imagens de upload)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3005;

// Função para semear usuários iniciais se o banco estiver vazio
const seedUsers = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Semeando usuários de teste iniciais...');
      
      await User.create({
        nome: 'Administrador 1001',
        email: 'admin@1001obra.com.br',
        senha: 'admin', // Bcrypt fará o hash automaticamente pelo hook beforeSave
        funcao: 'Admin'
      });

      await User.create({
        nome: 'Engenheiro Carlos',
        email: 'engenheiro@1001obra.com.br',
        senha: 'engenheiro',
        funcao: 'Engenheiro'
      });

      await User.create({
        nome: 'Cliente Exemplo',
        email: 'cliente@1001obra.com.br',
        senha: 'cliente',
        funcao: 'Cliente'
      });

      console.log('Usuários de teste criados com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao semear usuários:', err);
  }
};

const startServer = async () => {
  // Conecta ao Banco
  await connectDB();

  // Sincroniza Tabelas
  try {
    await sequelize.sync();
    console.log('Modelos Sequelize sincronizados com sucesso.');
    
    // Semeia dados iniciais
    await seedUsers();
  } catch (err) {
    console.error('Erro ao sincronizar tabelas:', err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
  });
};

startServer();
