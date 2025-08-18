const db = require('../db/db.js');


async function allAgentsOrFiltered({cargo, sort}) {
    let query = db('agentes');

    if  (cargo) {
        query = query.where('cargo', 'ilike', cargo);
    }

    if (sort) {
        const order = sort.startsWith('-') ? 'desc' : 'asc';
        const field = sort.replace('-', '');
        if (field === 'dataDeIncorporacao') {
            query = query.orderBy(field, order);
        }
    }

    const agents = await query.select('*');
    return agents;
}

async function agentsById(id) {
    try {
        const agent = await db('agentes').where('id', id).first();
        if (!agent) {
            return null;
        }
        return agent;
    } catch (error) {
        throw new Error('Não foi possível buscar o item.');
    } 
}

async function casesByAgent(id) {
    try {
        const result = await db('agentes')
        .select('casos.*')
        .join('casos', 'agentes.id','=','casos.agente_id')
        .where('agentes.id', id);

        return result;
    } catch (error) {
        throw new Error('Não foi possível buscar os casos atribuídos ao agente.');
    }
}

async function addNewAgentToRepo(newAgent) {
    try {
        const [createdAgent] = await db('agentes').insert(newAgent).returning('*');
        return createdAgent;
    } catch (error) {
        throw new Error('Não foi possível adicionar o novo agente.');
    }
}

async function updateAgentOnRepo(id, newData) {
    
    try {
        const [updatedAgent] = await db('agentes').where('id', id).update(newData).returning('*');
        if (updatedAgent) {
            return updatedAgent;
        }
    } catch (error) {
        throw new Error('Não foi possível atualizar o agente.');
    }
}

async function patchAgentOnRepo(id, newData) {
    try {
        const [updatedAgent] = await db('agentes').where('id', id).update(newData).returning('*');
        if (updatedAgent) {
            return updatedAgent;
        }
    } catch (error) {
        throw new Error('Não foi possível atualizar o agente.');
    }
}

async function deleteAgentOnRepo(id) {
    try {
        const deleteRows = await db('agentes').where('id', id).del();
        return deleteRows;
        
    } catch (error) {
        throw new Error('Não foi possível deletar o agente.');
    }
}

module.exports = {
    allAgentsOrFiltered,
    agentsById,
    casesByAgent,
    addNewAgentToRepo,
    updateAgentOnRepo,
    patchAgentOnRepo,
    deleteAgentOnRepo
} 


