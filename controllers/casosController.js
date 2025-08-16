const casosRepository = require('../repositories/casosRepository');
const { allAgents, agentsById } = require('../repositories/agentesRepository');
const {handleNotFound, handleBadRequest, handleInvalidId, handleCreated, handleNoContent} = require('../utils/errorHandler');
const { validUuid, validDate, verifyAgentExists, validStatus, validStatusesList } = require('../utils/validators');
const { v4: uuidv4 } = require('uuid');

function getAllCases(req, res){
    let {agente_id, status, q} = req.query;

    let filteredCases = casosRepository.allCases();

    if (agente_id) {

        agente_id = agente_id.toString().trim();

        if(!validUuid(agente_id)){
            return handleInvalidId(res, 'ID inválido');
        }

        filteredCases = filteredCases.filter(c => c.agente_id === agente_id);
        
        if (filteredCases.length == 0) {
            return handleNotFound(res, 'Não encontrado');
        }
        
    }

    if (status) {
        status = status.toString().trim();

        if (!validStatus(status)) {
            return handleBadRequest(res, `Status inválido. Status existentes: ${validStatusesList.join(', ')}`);
        }

        filteredCases = filteredCases.filter(c => c.status === status);

        if (filteredCases.length == 0) {
            return handleNotFound(res, 'Não encontrado');
        }
    }

    if (q) {
        q = q.toString().trim();

        filteredCases = filteredCases.filter(c => 
            c.titulo.toLowerCase().includes(q.toLowerCase()) ||
            c.descricao.toLowerCase().includes(q.toLowerCase())
        );
    }

    return res.status(200).json(filteredCases);
}

function getAgentByCase(req, res) {
    const id = req.params.id.toString().trim();

    if (!validUuid(id)) {
        return handleInvalidId(res, 'ID inválido');
    }


    const case_ = casosRepository.caseById(id);
    if(!case_) {
        return handleNotFound(res, 'Caso não encontrado');
    }

    const agent = agentsById(case_.agente_id);

    return res.status(200).json(agent);
}

function getCaseById(req, res){
    const id = req.params.id.trim();
    if (!validUuid(id)) {
        return handleInvalidId(res, 'ID mal formatado!');
    }
    const case_ = casosRepository.caseById(id);

    if (!case_) {
        return handleNotFound(res, 'Caso não encontrado');
    }

    res.status(200).json(case_);
}

function addNewCase(req, res){
    const {titulo, descricao, status, agente_id} = req.body;
    if (!titulo || !descricao || !status || !agente_id) {
        return handleBadRequest(res, 'Todos os campos precisam ser preenchidos!');
    }
    
    if (!validUuid(agente_id)) {
        return handleInvalidId(res, 'ID inválido');
    }

    const agents = allAgents();

    if (!verifyAgentExists(agente_id, agents)) {
        return handleNotFound(res, 'Agente não encontrado');
    }

    if (!validStatus(status)) {
        return handleBadRequest(res, `Status inválido. Valores permitidos: ${validStatusesList.join(', ')}`);
    }

    const newCase = {
        id: uuidv4(),
        titulo: titulo,
        descricao: descricao,
        status: status,
        agente_id: agente_id
    };

    casosRepository.addNewCaseOnRepo(newCase);

    return res.status(201).json(newCase);
}

function updateCase(req, res) {
    const id = req.params.id.trim();
    const updates = req.body;

    if (!validUuid(id)) {
        return handleInvalidId(res, 'ID inválido');
    }

    const existingCase = casosRepository.caseById(id);
    if (!existingCase) {
        return handleNotFound(res, 'Caso não encontrado!');
    }

    const allowedFields = ['titulo','descricao','status','agente_id'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return handleBadRequest(res, `Campos inválidos: ${invalidFields.join(', ')}`);
    }

    const requiredFields = ['titulo', 'descricao', 'status', 'agente_id'];

    for (const field of requiredFields) {
        if (!updates[field] || updates[field].toString().trim() === '') {
            return handleBadRequest(res, `Campo ${field} é obrigatório e não pode estar vazio`);
        }
    }

    if (!validStatus(updates.status)) {
        return handleBadRequest(res, `Status inválido. Valores permitidos: ${validStatusesList.join(', ')}`);
    }

    if (!validUuid(updates.agente_id)) {
        return handleInvalidId(res, 'O ID do agente é inválido');
    }

    const agents = allAgents();

    if (!verifyAgentExists(updates.agente_id, agents)) {
        return handleNotFound(res, 'Agente não encontrado');
    }
    
    if (updates.id) {
        return handleBadRequest(res, 'ID não pode ser alterado!');
    }

    const updateCase = casosRepository.updateCaseOnRepo(id, updates);

    if (!updateCase) {
        return handleNotFound(res, 'Caso não encontrado');
    }

    res.status(200).json(updateCase);
}

function patchCase(req, res) {
    const id = req.params.id.trim();
    const updates = req.body;

    if (!validUuid(id)) {
        return handleInvalidId(res, 'ID inválido');
    }

    const existingCase = casosRepository.caseById(id);
    if (!existingCase) {
        return handleNotFound(res, 'Caso não encontrado!');
    }

    if (Object.keys(updates).length === 0) {
        return handleBadRequest(res, 'Envie pelo menos um campo para atualização');
    }

    const allowedFields = ['titulo','descricao','status','agente_id'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return handleBadRequest(res, `Campos inválidos: ${invalidFields.join(', ')}`);
    }

    if (updates.id) {
        return handleBadRequest(res, 'Não é permitido alterar o ID!');
    }

    for (let field in updates) {
        if (updates[field].toString().trim() === "") {
            return handleBadRequest(res, `Campo ${field} não pode estar vazio`);
        }
    }

    if (updates.status) {
        if (!validStatus(updates.status)) {
            return handleBadRequest(res, `Status inválido. Valores permitidos: ${validStatusesList.join(', ')}`);
        }
    }

    if (updates.agente_id) {
        if(!validUuid(updates.agente_id)) {
            return handleInvalidId(res, 'O ID do agente é inválido!');
        }

        const agents = allAgents();
        if (!verifyAgentExists(updates.agente_id, agents)) {
            return handleNotFound(res, 'Agente não encontrado');
        }
    }

    const cases = casosRepository.allCases();
    
    const caseExists = cases.findIndex(c => c.id === id);
    if (caseExists === -1) {
        return handleNotFound(res, 'Caso não encontrado!');
    }


    const update = casosRepository.patchCaseOnRepo(id, updates);

    if (!update) {
        return handleNotFound(res, 'Caso não encontrado');
    }

    return res.status(200).json(update);

}

function deleteCase(req, res) {
    const id = req.params.id.trim();
    
    if(!validUuid(id)) {
        return handleInvalidId(res, 'Formato de ID inválido!');
    }

    const cases = casosRepository.allCases();
    const caseExists = cases.findIndex(c => c.id === id);

    if (caseExists === -1) {
        return handleNotFound(res, 'Caso não existente!');
    }

    const deleted = casosRepository.deleteCaseOnRepo(id);

    if (!deleted) {
        return handleNotFound(res, 'Caso não encontrado!');
    }

    return handleNoContent(res);
}

module.exports = {
    getAllCases,
    getAgentByCase,
    getCaseById,
    addNewCase,
    updateCase,
    patchCase,
    deleteCase
}