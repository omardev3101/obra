const Professional = require('../models/Professional');
const CompanySettings = require('../models/CompanySettings');

exports.createProfessional = async (req, res) => {
  try {
    const { nome, telefone, email, especialidade, cidade, cep, endereco, raioKm, fotoUrl, experiencia, aceitouTermos, percentualDescontoAcordado } = req.body;

    if (!nome || !telefone || !especialidade || !cidade) {
      return res.status(400).json({ error: 'Nome, Telefone, Especialidade e Cidade são obrigatórios.' });
    }

    if (!aceitouTermos) {
      return res.status(400).json({ error: 'Você precisa aceitar os termos e comissão da plataforma para concluir o cadastro.' });
    }

    const professional = await Professional.create({
      nome,
      telefone,
      email,
      especialidade,
      cidade,
      cep,
      endereco,
      raioKm: parseInt(raioKm) || 20,
      fotoUrl,
      experiencia,
      aceitouTermos: true,
      dataAceiteTermos: new Date(),
      percentualDescontoAcordado: percentualDescontoAcordado || 15.00
    });

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso! Aguarde a aprovação do Administrador.',
      professional
    });
  } catch (error) {
    console.error('Erro ao cadastrar profissional:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.getTermsSettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    return res.json({
      taxaComissaoProfissional: settings.taxaComissaoProfissional || 15.00,
      termosProfissionalTexto: settings.termosProfissionalTexto
    });
  } catch (error) {
    console.error('Erro ao buscar termos:', error);
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
