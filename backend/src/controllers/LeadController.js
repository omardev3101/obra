const Lead = require('../models/Lead');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

// Integração com Trello (opcional, pode ser ativada configurando as chaves no .env)
const TRELLO_API_KEY = process.env.TRELLO_API_KEY || "";
const TRELLO_TOKEN = process.env.TRELLO_TOKEN || "";
const TRELLO_LIST_ID = process.env.TRELLO_LIST_ID || "";

exports.createLead = async (req, res) => {
  try {
    const { nome, telefone, assunto, descricao, calculadoraDados, origemUrl } = req.body;

    if (!nome || !telefone || !assunto) {
      return res.status(400).json({ error: 'Nome, Telefone e Assunto são obrigatórios.' });
    }

    const lead = await Lead.create({
      nome,
      telefone,
      assunto,
      descricao,
      calculadoraDados,
      origemUrl
    });

    // Tenta enviar para o Trello se as credenciais existirem
    if (TRELLO_API_KEY && TRELLO_TOKEN && TRELLO_LIST_ID) {
      try {
        const cardName = `Lead: ${nome} - ${assunto}`;
        const cardDesc = `Telefone: ${telefone}\nDescrição: ${descricao || 'Nenhuma'}\nOrigem: ${origemUrl || 'Direto'}\n\nDetalhes Calculadora:\n${calculadoraDados ? JSON.stringify(calculadoraDados, null, 2) : 'Nenhum'}`;
        
        await fetch(`https://api.trello.com/1/cards?idList=${TRELLO_LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}&name=${encodeURIComponent(cardName)}&desc=${encodeURIComponent(cardDesc)}`, {
          method: 'POST'
        });
        console.log('Lead enviado para o Trello com sucesso!');
      } catch (trelloErr) {
        console.warn('Erro ao integrar com o Trello:', trelloErr.message);
      }
    }

    return res.status(201).json({
      message: 'Lead registrado com sucesso!',
      lead
    });
  } catch (error) {
    console.error('Erro ao registrar Lead:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.listLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(leads);
  } catch (error) {
    console.error('Erro ao listar Leads:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado.' });
    }

    await lead.update({ status });
    return res.json({ message: 'Status do lead atualizado!', lead });
  } catch (error) {
    console.error('Erro ao atualizar Lead:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
