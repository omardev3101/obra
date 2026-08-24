const { Op } = require('sequelize');
const ServiceRequest = require('../models/ServiceRequest');
const Professional = require('../models/Professional');

// Diárias base estimadas para cada tipo de serviço
const DIARIAS_BASE = {
  'Pedreiro': 220.00,
  'Pintor': 150.00,
  'Eletricista': 180.00,
  'Encanador': 160.00,
  'Gesseiro': 170.00,
  'Ajudante Geral': 100.00,
  'Mestre de Obras': 300.00,
  'Desentupidora': 250.00,
  'Marido de Aluguel': 120.00,
  'Jardineiro': 110.00,
  'Ar Condicionado': 200.00
};

// Preços médios por metro quadrado (m²)
const PRECOS_M2 = {
  'Pedreiro': 65.00,
  'Pintor': 35.00,
  'Eletricista': 45.00,
  'Encanador': 40.00,
  'Gesseiro': 50.00,
  'Ajudante Geral': 25.00,
  'Mestre de Obras': 90.00,
  'Desentupidora': 80.00, // Preço fixo/m² adaptado
  'Marido de Aluguel': 60.00,
  'Jardineiro': 15.00,
  'Ar Condicionado': 75.00
};

const mapearEspecialidade = (servico) => {
  const s = servico.toLowerCase();
  if (s.includes('pedreiro') || s.includes('alvenaria') || s.includes('muro') || s.includes('fundação')) return 'Pedreiro';
  if (s.includes('eletricista') || s.includes('fiação') || s.includes('elétrica')) return 'Eletricista';
  if (s.includes('pintor') || s.includes('pintura') || s.includes('massa corrida') || s.includes('textura')) return 'Pintor';
  if (s.includes('encanador') || s.includes('hidráulica') || s.includes('vazamento')) return 'Encanador';
  if (s.includes('gesso') || s.includes('drywall') || s.includes('sanca')) return 'Gesseiro';
  if (s.includes('desentupidora') || s.includes('desentupir')) return 'Desentupidora';
  if (s.includes('marido de aluguel')) return 'Marido de Aluguel';
  if (s.includes('jardim') || s.includes('jardineiro') || s.includes('piscina')) return 'Jardineiro';
  if (s.includes('ar condicionado') || s.includes('climatização')) return 'Ar Condicionado';
  if (s.includes('mestre de obras') || s.includes('obra')) return 'Mestre de Obras';
  return 'Ajudante Geral';
};

exports.getEstimate = async (req, res) => {
  try {
    const { servicoSelecionado, cidade, bairro, tipoPreco, metragem, quantidadeDias } = req.body;

    if (!servicoSelecionado || !cidade || !bairro) {
      return res.status(400).json({ error: 'Serviço, Cidade e Bairro são obrigatórios.' });
    }

    const especialidade = mapearEspecialidade(servicoSelecionado);
    let precoBase = 120.00;

    if (tipoPreco === 'Diária') {
      const valorDiaria = DIARIAS_BASE[especialidade] || 120.00;
      const dias = parseInt(quantidadeDias) || 1;
      precoBase = valorDiaria * dias;
    } else {
      // Preço Fechado (por m²)
      const valorM2 = PRECOS_M2[especialidade] || 40.00;
      const m2 = parseFloat(metragem) || 10; // default 10m²
      precoBase = valorM2 * m2;
    }

    // 1. Calcula a Densidade de Demanda (solicitações nos últimos 30 min)
    const trintaMinAtras = new Date(Date.now() - 30 * 60 * 1000);
    const solicitacoesAtivas = await ServiceRequest.count({
      where: {
        cidade,
        bairro,
        createdAt: { [Op.gt]: trintaMinAtras },
        status: { [Op.in]: ['Buscando', 'Aceito'] }
      }
    });

    // 2. Calcula profissionais aprovados ativos na mesma cidade
    const profissionaisDisponiveis = await Professional.count({
      where: { cidade, especialidade, status: 'Aprovado' }
    });

    // Algoritmo de Multiplicador Dinâmico (Estilo Uber)
    let multiplicador = 1.00;
    const profsCount = profissionaisDisponiveis || 1;

    if (solicitacoesAtivas > profsCount) {
      const excesso = solicitacoesAtivas - profsCount;
      multiplicador = 1.00 + (excesso * 0.20);
      if (multiplicador > 2.50) multiplicador = 2.50;
    }

    const precoEstimado = precoBase * multiplicador;
    const taxaIntermediacao = precoEstimado * 0.15;

    return res.json({
      especialidade,
      precoBase: parseFloat(precoBase.toFixed(2)),
      multiplicador: parseFloat(multiplicador.toFixed(2)),
      precoEstimado: parseFloat(precoEstimado.toFixed(2)),
      taxaIntermediacao: parseFloat(taxaIntermediacao.toFixed(2)),
      solicitacoesAtivas,
      profissionaisDisponiveis
    });
  } catch (error) {
    console.error('Erro ao calcular estimativa:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { 
      clienteNome, 
      clienteTelefone, 
      servicoSelecionado, 
      cidade, 
      bairro, 
      precoEstimado, 
      taxaIntermediacao, 
      multiplicadorDinamico,
      metragem,
      tipoPreco,
      quantidadeDias,
      fotosVideos
    } = req.body;

    if (!clienteNome || !clienteTelefone || !servicoSelecionado || !cidade || !bairro || !precoEstimado) {
      return res.status(400).json({ error: 'Dados incompletos para abrir o chamado.' });
    }

    const request = await ServiceRequest.create({
      clienteNome,
      clienteTelefone,
      servicoSelecionado,
      cidade,
      bairro,
      precoEstimado,
      taxaIntermediacao: taxaIntermediacao || (precoEstimado * 0.15),
      multiplicadorDinamico: multiplicadorDinamico || 1.00,
      metragem: metragem ? parseFloat(metragem) : null,
      tipoPreco: tipoPreco || 'Preço Fechado',
      quantidadeDias: quantidadeDias ? parseInt(quantidadeDias) : 1,
      fotosVideos: fotosVideos ? JSON.stringify(fotosVideos) : null
    });

    return res.status(201).json({
      message: 'Chamado aberto com sucesso! Aguardando profissional aceitar.',
      request
    });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.listPendingRequests = async (req, res) => {
  try {
    const { cidade } = req.query;

    const whereClause = { status: 'Buscando' };
    if (cidade) {
      whereClause.cidade = cidade;
    }

    const requests = await ServiceRequest.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return res.json(requests);
  } catch (error) {
    console.error('Erro ao listar chamados pendentes:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const ServiceStep = require('../models/ServiceStep');

const criarEtapasPadrao = async (serviceRequestId, servicoSelecionado) => {
  const etapasPadrao = [
    { ordem: 1, titulo: '1. Vistoria Inicial & Preparação do Local', descricao: 'Alinhamento do escopo com o cliente, proteção da área de trabalho e preparação dos materiais.', status: 'Pendente' },
    { ordem: 2, titulo: '2. Execução da Infraestrutura / Base', descricao: 'Quebras, alvenaria, passagem de tubulação ou montagem da estrutura base da obra.', status: 'Pendente' },
    { ordem: 3, titulo: '3. Execução Principal & Instalação', descricao: 'Aplicação de revestimentos, fiação, pintura de base ou montagem do serviço contratado.', status: 'Pendente' },
    { ordem: 4, titulo: '4. Acabamento & Limpeza Técnica', descricao: 'Lixamento, retocamento, testes funcionais de instalação e recolhimento de entulhos.', status: 'Pendente' },
    { ordem: 5, titulo: '5. Vistoria Final & Entrega das Chaves', descricao: 'Conferência final com o cliente/engenheiro e validação do termo de conclusão.', status: 'Pendente' }
  ];

  for (const step of etapasPadrao) {
    await ServiceStep.create({
      serviceRequestId,
      ordem: step.ordem,
      titulo: step.titulo,
      descricao: step.descricao,
      status: step.status
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { profissionalId } = req.body;

    if (!profissionalId) {
      return res.status(400).json({ error: 'Profissional ID é obrigatório.' });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    if (request.status !== 'Buscando') {
      return res.status(400).json({ error: 'Este chamado já foi aceito ou cancelado.' });
    }

    await request.update({
      status: 'Aceito',
      profissionalId
    });

    // Cria as etapas padrão do cronograma para acompanhamento
    await criarEtapasPadrao(request.id, request.servicoSelecionado);

    return res.json({
      message: 'Você aceitou o serviço com sucesso! Cronograma de etapas gerado.',
      request
    });
  } catch (error) {
    console.error('Erro ao aceitar chamado:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, justificativaCancelamento } = req.body;

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    const updates = { status };
    if (status === 'Cancelado' && justificativaCancelamento) {
      updates.justificativaCancelamento = justificativaCancelamento;
    }

    await request.update(updates);
    return res.json({ message: 'Status do chamado atualizado!', request });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    let profissional = null;
    if (request.profissionalId) {
      profissional = await Professional.findByPk(request.profissionalId);
    }

    return res.json({ request, profissional });
  } catch (error) {
    console.error('Erro ao buscar chamado por ID:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.proposeAddition = async (req, res) => {
  try {
    const { id } = req.params;
    const { precoAdicional, justificativaAdicional } = req.body;

    if (!precoAdicional || !justificativaAdicional) {
      return res.status(400).json({ error: 'Preço e descrição da adição são obrigatórios.' });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    await request.update({
      precoAdicional: parseFloat(precoAdicional),
      justificativaAdicional,
      aprovadoAdicional: 'Pendente'
    });

    return res.json({ message: 'Acréscimo de serviço proposto com sucesso!', request });
  } catch (error) {
    console.error('Erro ao propor serviço adicional:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.respondToAddition = async (req, res) => {
  try {
    const { id } = req.params;
    const { aprovado } = req.body; // true ou false

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    if (aprovado) {
      const novoPreco = parseFloat(request.precoEstimado) + parseFloat(request.precoAdicional);
      const novaTaxa = novoPreco * 0.15;
      await request.update({
        precoEstimado: novoPreco,
        taxaIntermediacao: novaTaxa,
        aprovadoAdicional: 'Aprovado'
      });
    } else {
      await request.update({
        aprovadoAdicional: 'Recusado'
      });
    }

    return res.json({ message: 'Resposta ao acréscimo registrada!', request });
  } catch (error) {
    console.error('Erro ao responder ao acréscimo:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.listAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json(requests);
  } catch (error) {
    console.error('Erro ao listar todos os chamados:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.getSteps = async (req, res) => {
  try {
    const { id } = req.params;
    let steps = await ServiceStep.findAll({
      where: { serviceRequestId: id },
      order: [['ordem', 'ASC']]
    });

    // Se o serviço não possui etapas geradas ainda, gerar automaticamente
    if (steps.length === 0) {
      const request = await ServiceRequest.findByPk(id);
      if (request) {
        await criarEtapasPadrao(id, request.servicoSelecionado);
        steps = await ServiceStep.findAll({
          where: { serviceRequestId: id },
          order: [['ordem', 'ASC']]
        });
      }
    }

    return res.json(steps);
  } catch (error) {
    console.error('Erro ao buscar etapas do cronograma:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.updateStepStatus = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status, fotoComprovante, observacaoCampo } = req.body;

    const step = await ServiceStep.findByPk(stepId);
    if (!step) {
      return res.status(404).json({ error: 'Etapa do cronograma não encontrada.' });
    }

    const updates = { status };
    if (status === 'Concluido') {
      updates.dataConclusao = new Date();
    }
    if (fotoComprovante) updates.fotoComprovante = fotoComprovante;
    if (observacaoCampo) updates.observacaoCampo = observacaoCampo;

    await step.update(updates);

    // Atualiza progresso e verifica se todas as etapas foram concluídas
    const allSteps = await ServiceStep.findAll({ where: { serviceRequestId: step.serviceRequestId } });
    const concludedCount = allSteps.filter(s => s.status === 'Concluido').length;
    
    // Opcional: Se todas concluídas, atualizar o chamado
    if (concludedCount === allSteps.length && allSteps.length > 0) {
      await ServiceRequest.update({ status: 'Finalizado' }, { where: { id: step.serviceRequestId } });
    }

    return res.json({ message: 'Etapa atualizada com sucesso!', step, progress: Math.round((concludedCount / allSteps.length) * 100) });
  } catch (error) {
    console.error('Erro ao atualizar etapa:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

