/* A fazer */

const casosRepository = require('../repositories/casosRepository');
const { agentsById } = require('../repositories/agentesRepository');
const {handleNotFound, handleBadRequest, handleInvalidId, handleCreated, handleNoContent} = require('../utils/errorHandler');
const {validStatus, validStatusesList } = require('../utils/validators');

async function getAllCases(req, res){
    try {
        let {agente_id, status, q} = req.query;
        
        if (!agente_id || isNaN(Number(agente_id)) || !Number.isInteger(Number(agente_id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        if (status) {
            status = status.toString().trim();

            if (!validStatus(status)) {
                return handleBadRequest(res, `Status inválido. Status existentes: ${validStatusesList.join(', ')}`);
            }
        }

        if (q) {
            q = q.toString().trim();
        }

        const result = await casosRepository.filteredCases({agente_id, status, q});
        if (!result || result.length === 0) {
            return handleNotFound(res, 'Nenhum resultado');
        }
        return res.status(200).json(result);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar casos');
    }
    
}

async function getAgentByCase(req, res) {
    try {
        const id = req.params.id;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const case_ = await casosRepository.caseById(id);
        if(!case_) {
            return handleNotFound(res, 'Caso não encontrado');
        }

        const agent = await casosRepository.agentByCase(id);;

        return res.status(200).json(agent);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar agente pelo caso');
    }
    
}

async function getCaseById(req, res){
    try {
        const id = req.params.id;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const case_= await casosRepository.caseById(id);
        if (!case_) {
            return handleNotFound(res, 'Caso não encontrado');
        }
        return res.status(200).json(case_);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar caso');
    }
}

async function addNewCase(req, res){
    try {
        const { titulo, descricao, status, agente_id } = req.body;
        if (!titulo || !descricao || !status || !agente_id) {
            return handleBadRequest(res, 'Todos os campos precisam ser preenchidos!');
        }

        if (!agente_id || isNaN(Number(agente_id)) || !Number.isInteger(Number(agente_id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const agentExists = await agentsById(agente_id);
        if (!agentExists) {
            return handleNotFound(res, 'Agente não encontrado');
        }

         const isValidStatus = validStatus(status);
        if (!isValidStatus) {
            return handleBadRequest(res, `Status inválido. Valores permitidos: ${validStatusesList.join(', ')}`);
        }   

        const newCase = {
            titulo,
            descricao,
            status: status.toLowerCase(),
            agente_id
        }; 

        const createdCase = await casosRepository.addNewCaseOnRepo(newCase);

        if (!createdCase) {
            return handleBadRequest(res, 'Erro ao cadastrar caso');
        }
        return handleCreated(res, createdCase, 'Caso cadastrado com sucesso');


    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao cadastrar caso');
    }
}

async function updateCase(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const caseExists = await casosRepository.caseById(id);
        if (!caseExists) {
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


        if (!updates.agente_id || isNaN(Number(updates.agente_id)) || !Number.isInteger(Number(updates.agente_id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const agentExists = await agentsById(updates.agente_id);

        if (!agentExists) {
            return handleNotFound(res, 'Agente não encontrado');
        }
        
        if (updates.id) {
            return handleBadRequest(res, 'ID não pode ser alterado!');
        }

        const updateInfo = {
            "titulo": updates.titulo,
            "descricao": updates.descricao,
            "status": updates.status.toLowerCase(),
            "agente_id": updates.agente_id
        }
        const updateCase = await casosRepository.updateCaseOnRepo(id, updateInfo);

        if (!updateCase) {
            return handleNotFound(res, 'Caso não encontrado');
        }

        res.status(200).json(updateCase);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao atualizar caso');
    }
    
}

async function patchCase(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const caseExists = await casosRepository.caseById(id);
        if (!caseExists) {
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
            if (!updates.agente_id || isNaN(Number(updates.agente_id)) || !Number.isInteger(Number(updates.agente_id))) {
                return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
            }
            const agentExists = await agentsById(updates.agente_id);
            if (!agentExists) {
                return handleNotFound(res, 'Agente não encontrado');
            }
        }

        const update = await casosRepository.patchCaseOnRepo(id, updates);

        if (!update) {
            return handleNotFound(res, 'Caso não encontrado');
        }
        return res.status(200).json(update);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao atualizar caso');
    }
}

async function deleteCase(req, res) {
    try {
        const id = req.params.id;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const caseExists = await casosRepository.caseById(id);
        if (!caseExists) {
            return handleNotFound(res, 'Caso não encontrado!');
        }
        const deleted = await casosRepository.deleteCaseOnRepo(id);

        if (!deleted) {
            return handleNotFound(res, 'Caso não deletado!');
        }
        return handleNoContent(res);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao deletar caso');
    }
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