const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');

const AuthController = require('../controllers/AuthController');
const SEOController = require('../controllers/SEOController');
const LeadController = require('../controllers/LeadController');
const ProjectController = require('../controllers/ProjectController');
const ProfessionalController = require('../controllers/ProfessionalController');
const RequestController = require('../controllers/RequestController');

// --- Rotas Públicas ---

// Autenticação
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// SEO Local dinâmico
// Rota completa com bairro
router.get('/seo/:servicoSlug/:cidadeSlug/:bairroSlug', SEOController.getPage);
// Rota apenas com cidade (bairro assume "centro")
router.get('/seo/:servicoSlug/:cidadeSlug', SEOController.getPage);
router.get('/seo-list', SEOController.listPages);

// Registro de Leads (do formulário e calculadora)
router.post('/leads', LeadController.createLead);

// Registro de Profissionais (Trabalhe Conosco e Convite)
router.get('/professionals/terms-settings', ProfessionalController.getTermsSettings);
router.post('/professionals', ProfessionalController.createProfessional);

// Portfólio de Projetos
router.get('/projects', ProjectController.listProjects);

// --- Rotas Privadas (Requer Autenticação JWT) ---

router.get('/auth/me', authMiddleware, AuthController.me);

// Gerenciamento de Overrides do SEO Local
router.post('/seo-override', authMiddleware, SEOController.createPageOverride);
router.delete('/seo/:id', authMiddleware, SEOController.deletePage);

// Listagem e atualização de leads
router.get('/leads', authMiddleware, LeadController.listLeads);
router.patch('/leads/:id/status', authMiddleware, LeadController.updateLeadStatus);

// Listagem e atualização de profissionais cadastrados
router.get('/professionals', authMiddleware, ProfessionalController.listProfessionals);
router.patch('/professionals/:id/status', authMiddleware, ProfessionalController.updateStatus);

// Cadastro e exclusão de projetos do portfólio
router.post('/projects', authMiddleware, ProjectController.createProject);
router.delete('/projects/:id', authMiddleware, ProjectController.deleteProject);

// --- Chamados sob Demanda (Estilo Uber) ---
router.post('/requests/estimate', RequestController.getEstimate);
router.post('/requests', RequestController.createRequest);
router.get('/requests/pending', RequestController.listPendingRequests);
router.get('/requests', authMiddleware, RequestController.listAllRequests);
router.get('/requests/:id', RequestController.getRequestById);
router.patch('/requests/:id/accept', RequestController.acceptRequest);
router.patch('/requests/:id/status', RequestController.updateRequestStatus);
router.post('/requests/:id/propose-addition', RequestController.proposeAddition);
router.post('/requests/:id/respond-addition', RequestController.respondToAddition);
router.get('/requests/:id/steps', RequestController.getSteps);
router.patch('/requests/steps/:stepId', RequestController.updateStepStatus);

const SettingsController = require('../controllers/SettingsController');

// Configurações Institucionais (Logo, Telefone, WhatsApp, Horários, etc)
router.get('/settings', SettingsController.getSettings);
router.post('/settings', authMiddleware, SettingsController.updateSettings);

module.exports = router;
