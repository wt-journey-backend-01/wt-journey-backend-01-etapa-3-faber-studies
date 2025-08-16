const agentesRepository = require('../repositories/agentesRepository.js');
const {handleNotFound, handleBadRequest, handleCreated, handleNoContent, handleInvalidId} = require('../utils/errorHandler.js')
const {validDate} = require('../utils/validators.js');


async function getAgentes(req, res) {
    try {
        const {cargo, sort} = req.query;
        let agentes = await agentesRepository.allAgents();
        if (cargo) {
            agentes = agentes.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase());
        }

        if (sort) {
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            const field = sort.replace('-', '');

            if (field === 'dataDeIncorporacao') {
                agentes.sort((a, b) => {
                    const dateA = new Date(a.dataDeIncorporacao);
                    const dateB = new Date(b.dataDeIncorporacao);

                    return order === 'asc' ? dateA - dateB : dateB - dateA;
                });
            }
        }

        res.status(200).json(agentes);

    } catch (error) {
        return handleBadRequest(res, error.message || 'Erro ao buscar agentes');
    }
}
    


async function getAgentById(req, res) {
    try {
        const id = req.params.id.trim();

        if (!id) {
            return handleBadRequest(res, 'ID do agente não fornecido.');
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
        const id = req.params.id.trim();
        const {nome, dataDeIncorporacao, cargo} = req.body;

        if (!id){
            return handleBadRequest(res, 'Forneça o ID');
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
        const id = req.params.id.trim();
        const updates = req.body;

        if (!id){
            return handleBadRequest(res, 'Forneça o ID');
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
    const id = req.params.id.trim();

    if (!id) {
        return handleInvalidId(res, 'ID inválido ou mal formatado');
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
    addNewAgent,
    updateAgent,
    patchAgent,
    deleteAgent
}