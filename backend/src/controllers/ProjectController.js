const Project = require('../models/Project');

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(projects);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { titulo, categoria, localizacao, metragem, tempoExecucao, imagemAntes, imagemDepois, escopo } = req.body;

    if (!titulo || !categoria || !localizacao) {
      return res.status(400).json({ error: 'Título, Categoria e Localização são obrigatórios.' });
    }

    const project = await Project.create({
      titulo,
      categoria,
      localizacao,
      metragem,
      tempoExecucao,
      imagemAntes,
      imagemDepois,
      escopo
    });

    return res.status(201).json({ message: 'Projeto criado com sucesso!', project });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    await project.destroy();
    return res.json({ message: 'Projeto excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
