const agentesRepository = require('../repositories/agentesRepository.js');
const {handleNotFound, handleBadRequest, handleCreated, handleNoContent, handleInvalidId} = require('../utils/errorHandler.js')
const {validDate} = require('../utils/validators.js');


async function getAgentes(req, res) {
    try {
        let {cargo, sort} = req.query;
        if (sort) {
            sort = sort.trim();
        }
        if (cargo) {
            cargo=cargo.trim();
        }
        const result = await agentesRepository.allAgentsOrFiltered({cargo, sort});
        res.status(200).json(result);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar agentes');
    }
}
    


async function getAgentById(req, res) {
    try {
        const id = req.params.id;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const agent = await agentesRepository.agentsById(id);
        if (!agent) {
            return handleNotFound(res, 'Agente não encontrado');
        }
        res.status(200).json(agent);
    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar agente por ID');
    }
}
    
async function getCasesByAgent(req, res) {
    try {
        const id = req.params.id;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const cases = await agentesRepository.casesByAgent(id);

        if (cases.length == 0) {
            return handleNotFound(res, "Nenhum caso encontrado para esse agente.");
        }
        
        res.status(200).json(cases);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao procurar casos atribuidos a um Agente');
    }    
}


async function addNewAgent(req, res) {
     try {
        const { nome, dataDeIncorporacao, cargo } = req.body;

        const {dateValidation, error} = validDate(dataDeIncorporacao);

        if (!nome || !dataDeIncorporacao || !cargo) {
            return handleBadRequest(res, "Todos os campos são obrigatórios!");
        }

        if (!dateValidation) {
            if (error === "false format") {
                return handleBadRequest(res, "Campo dataDeIncorporacao deve serguir o formato 'YYYY-MM-DD");   
            }
            if (error === "future date") {
                return handleBadRequest(res, 'Data de incorporação não pode ser futura!');
            }
        }

        const newAgent = {
            nome,
            dataDeIncorporacao,
            cargo
        };

        const createdAgent = await agentesRepository.addNewAgentToRepo(newAgent);

        if (createdAgent) {
            return handleCreated(res, createdAgent);
        }


    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao adicionar novo agente');
    }
}


async function updateAgent(req, res) {
    try {
        const id = req.params.id;
        const {nome, dataDeIncorporacao, cargo} = req.body;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const agentExists= await agentesRepository.agentsById(id);

        if (!agentExists) {
            return handleNotFound(res, 'Agente não encontrado!');
        }

        if (!nome || !dataDeIncorporacao || !cargo) {
            return handleBadRequest(res, 'Todos os campos devem ser preenchidos!');
        }

        if (req.body.id) {
            return handleBadRequest(res, 'Campo ID não pode ser alterado!');
        }

        const {dateValidation, error} = validDate(dataDeIncorporacao);
        if (!dateValidation) {
            if (error === "false format") {
                return handleBadRequest(res, "Campo dataDeIncorporacao deve serguir o formato 'YYYY-MM-DD");   
            }
            if (error === "future date") {
                return handleBadRequest(res, 'Data de incorporação não pode ser futura!');
            }
        }

        const updatedAgent = await agentesRepository.updateAgentOnRepo(id, {nome, dataDeIncorporacao, cargo});

        if (!updatedAgent) {
            return handleNotFound(res, 'Agente não encontrado!');
        }

        res.status(200).json(updatedAgent);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao atualizar agente');
    }

    
}


async function patchAgent(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
        }

        const agentExists= await agentesRepository.agentsById(id);

        if (!agentExists) {
            return handleNotFound(res, 'Agente não encontrado!');
        }

        if (!updates || Object.keys(updates).length === 0) {
        return handleBadRequest(res, 'Envie ao menos um campo para atualizar!');
        }

        const allowedFields = ['nome','dataDeIncorporacao','cargo'];
        const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return handleBadRequest(res, `Campos inválidos: ${invalidFields.join(', ')}`);
        }

        if (req.body.id) {
            return handleBadRequest(res, 'Campo ID não pode ser alterado!');
        }

        if (updates.dataDeIncorporacao) {
            const {dateValidation, error} = validDate(updates.dataDeIncorporacao);
            if (!dateValidation) {
                if (error === "false format") {
                    return handleBadRequest(res, "Campo dataDeIncorporacao deve serguir o formato 'YYYY-MM-DD");   
                }
                if (error === "future date") {
                    return handleBadRequest(res, 'Data de incorporação não pode ser futura!');
                }
            }
        }

        const patchedAgent = await agentesRepository.patchAgentOnRepo(id, updates);

        if (!patchedAgent) {
            return handleNotFound(res, 'Agente não encontrado!');
        }

        res.status(200).json(patchedAgent);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao atualizar agente');
    }
}


async function deleteAgent(req, res) {
    const id = req.params.id;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
        return handleBadRequest(res, 'ID inválido. O ID deve ser um número inteiro.');
    }

    const agentExists = await agentesRepository.agentsById(id);

    if (!agentExists) {
        return handleNotFound(res, 'Agente não encontrado');
    }

    const deleted = await agentesRepository.deleteAgentOnRepo(id);

    if (!deleted) {
        return handleNotFound(res, 'Agente não encontrado');
    }

    return handleNoContent(res);
}


module.exports = {
    getAgentes,
    getAgentById,
    getCasesByAgent,
    addNewAgent,
    updateAgent,
    patchAgent,
    deleteAgent
}