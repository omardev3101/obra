const CompanySettings = require('../models/CompanySettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = await CompanySettings.create({ id: 1 });
    }
    return res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações da empresa:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { nomeEmpresa, logoUrl, telefone, whatsapp, email, horarioFuncionamento, endereco, instagram, facebook, linkedin, youtube, metaTitulo, metaDescricao, metaPalavrasChave, ogImage } = req.body;
    let settings = await CompanySettings.findOne({ where: { id: 1 } });
    
    if (!settings) {
      settings = await CompanySettings.create({
        id: 1,
        nomeEmpresa,
        logoUrl,
        telefone,
        whatsapp,
        email,
        horarioFuncionamento,
        endereco,
        instagram,
        facebook,
        linkedin,
        youtube,
        metaTitulo,
        metaDescricao,
        metaPalavrasChave,
        ogImage
      });
    } else {
      await settings.update({
        nomeEmpresa: nomeEmpresa || settings.nomeEmpresa,
        logoUrl: logoUrl || settings.logoUrl,
        telefone: telefone || settings.telefone,
        whatsapp: whatsapp || settings.whatsapp,
        email: email || settings.email,
        horarioFuncionamento: horarioFuncionamento || settings.horarioFuncionamento,
        endereco: endereco || settings.endereco,
        instagram: instagram || settings.instagram,
        facebook: facebook || settings.facebook,
        linkedin: linkedin || settings.linkedin,
        youtube: youtube || settings.youtube,
        metaTitulo: metaTitulo || settings.metaTitulo,
        metaDescricao: metaDescricao || settings.metaDescricao,
        metaPalavrasChave: metaPalavrasChave || settings.metaPalavrasChave,
        ogImage: ogImage || settings.ogImage
      });
    }

    return res.json({ message: 'Configurações atualizadas com sucesso!', settings });
  } catch (error) {
    console.error('Erro ao atualizar configurações da empresa:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
