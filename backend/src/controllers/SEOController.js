const SEOPage = require('../models/SEOPage');

const capitalizeWord = (str) => {
  if (!str) return '';
  const lowerWords = ['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'com', 'para', 'a', 'o'];
  return str.split('-').map(word => {
    if (lowerWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

exports.getPage = async (req, res) => {
  try {
    const { servicoSlug, cidadeSlug, bairroSlug } = req.params;

    // Procura por uma página com override personalizado no banco
    let page = await SEOPage.findOne({
      where: {
        servicoSlug: servicoSlug.toLowerCase(),
        cidadeSlug: cidadeSlug.toLowerCase(),
        bairroSlug: (bairroSlug || 'centro').toLowerCase()
      }
    });

    // Se não existir, gera dinamicamente sob demanda para garantir indexação do Google
    if (!page) {
      const servico = capitalizeWord(servicoSlug);
      const cidade = capitalizeWord(cidadeSlug);
      const bairro = capitalizeWord(bairroSlug || 'centro');

      page = {
        servico,
        servicoSlug: servicoSlug.toLowerCase(),
        cidade,
        cidadeSlug: cidadeSlug.toLowerCase(),
        bairro,
        bairroSlug: (bairroSlug || 'centro').toLowerCase(),
        tituloSEO: `${servico} em ${bairro}, ${cidade} | 1001 Obra`,
        descricaoSEO: `Procurando por ${servico} em ${bairro}, ${cidade}? A 1001 Obra é especialista em engenharia, reformas e construções civis. Orçamento rápido via WhatsApp!`,
        conteudoH1: `${servico} em ${bairro}, ${cidade}`,
        textoPersonalizado: `Precisando de soluções profissionais de ${servico} na região de ${bairro} em ${cidade}? A equipe da 1001 Obra oferece mão de obra altamente qualificada, acompanhamento técnico completo por engenheiros com emissão de ART, além de conformidade com todas as normas técnicas vigentes. Garantimos eficiência, limpeza e materiais de alto padrão em cada projeto realizado.`
      };
    }

    return res.json(page);
  } catch (error) {
    console.error('Erro ao buscar SEO Page:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.createPageOverride = async (req, res) => {
  try {
    const { servico, servicoSlug, cidade, cidadeSlug, bairro, bairroSlug, tituloSEO, descricaoSEO, conteudoH1, textoPersonalizado, imagemAntes, imagemDepois } = req.body;

    if (!servico || !cidade) {
      return res.status(400).json({ error: 'Serviço e Cidade são obrigatórios.' });
    }

    const bName = bairro || 'Centro';
    const sSlug = (servicoSlug || servico.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')).toLowerCase();
    const cSlug = (cidadeSlug || cidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')).toLowerCase();
    const bSlug = (bairroSlug || bName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')).toLowerCase();

    const [page, created] = await SEOPage.findOrCreate({
      where: { servicoSlug: sSlug, cidadeSlug: cSlug, bairroSlug: bSlug },
      defaults: {
        servico,
        servicoSlug: sSlug,
        cidade,
        cidadeSlug: cSlug,
        bairro: bName,
        bairroSlug: bSlug,
        tituloSEO: tituloSEO || `${servico} em ${cidade} | 1001 Obra`,
        descricaoSEO: descricaoSEO || `Serviço especializado de ${servico} em ${cidade}. Entre em contato para orçamentos.`,
        conteudoH1: conteudoH1 || `${servico} em ${cidade}`,
        textoPersonalizado,
        imagemAntes,
        imagemDepois
      }
    });

    if (!created) {
      await page.update({
        servico,
        cidade,
        bairro: bName,
        tituloSEO: tituloSEO || page.tituloSEO,
        descricaoSEO: descricaoSEO || page.descricaoSEO,
        conteudoH1: conteudoH1 || page.conteudoH1,
        textoPersonalizado: textoPersonalizado || page.textoPersonalizado,
        imagemAntes: imagemAntes || page.imagemAntes,
        imagemDepois: imagemDepois || page.imagemDepois
      });
    }

    return res.json({ message: 'Página de SEO Local configurada com sucesso!', page });
  } catch (error) {
    console.error('Erro ao salvar página de SEO Local:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.listPages = async (req, res) => {
  try {
    const pages = await SEOPage.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(pages);
  } catch (error) {
    console.error('Erro ao listar páginas de SEO:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await SEOPage.findByPk(id);
    if (!page) {
      return res.status(404).json({ error: 'Página de SEO não encontrada.' });
    }
    await page.destroy();
    return res.json({ message: 'Página excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar página de SEO:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
