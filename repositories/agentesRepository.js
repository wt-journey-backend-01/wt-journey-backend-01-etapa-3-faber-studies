const db = require('../db/db.js');


async function allAgents() {
    try {
        const agents = await db('agentes').select('*');
        console.log("Agents fetched successfully:", agents);
        return agents;
    } catch (error) {
        console.error("Error fetching agents:", error);
        throw new Error('Não foi possível buscar os itens.');
    }
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
    allAgents,
    agentsById,
    addNewAgentToRepo,
    updateAgentOnRepo,
    patchAgentOnRepo,
    deleteAgentOnRepo
} 


