const Professional = require('../models/Professional');

exports.createProfessional = async (req, res) => {
  try {
    const { nome, telefone, email, especialidade, cidade, experiencia } = req.body;

    if (!nome || !telefone || !especialidade || !cidade) {
      return res.status(400).json({ error: 'Nome, Telefone, Especialidade e Cidade são obrigatórios.' });
    }

    const professional = await Professional.create({
      nome,
      telefone,
      email,
      especialidade,
      cidade,
      experiencia
    });

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso! Nossa equipe entrará em contato.',
      professional
    });
  } catch (error) {
    console.error('Erro ao cadastrar profissional:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.listProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(professionals);
  } catch (error) {
    console.error('Erro ao listar profissionais:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const professional = await Professional.findByPk(id);
    if (!professional) {
      return res.status(404).json({ error: 'Cadastro não encontrado.' });
    }

    await professional.update({ status });
    return res.json({ message: 'Status do profissional atualizado!', professional });
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
