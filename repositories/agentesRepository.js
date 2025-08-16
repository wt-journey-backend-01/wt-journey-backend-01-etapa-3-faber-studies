const db = require('../db/db.js');
const { handleNotFound } = require('../utils/errorHandler.js');
/*const agents = [
    {
        "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
        "nome": "Rommel Carneiro",
        "dataDeIncorporacao": "1992-10-04",
        "cargo": "delegado"
    },
    {
        "id": "502bccf5-cf9e-489d-8412-446cd169a0f2",
        "nome": "Ana Paula Silva",
        "dataDeIncorporacao": "2005-05-15",
        "cargo": "investigadora"
    },
    {
        "id": "603bccf5-cf9e-489d-8412-446cd169a0f3",
        "nome": "Carlos Alberto Souza",
        "dataDeIncorporacao": "2010-08-20",
        "cargo": "agente de polícia"
    },
    {
        "id": "704bccf5-cf9e-489d-8412-446cd169a0f4",
        "nome": "Fernanda Lima",
        "dataDeIncorporacao": "2018-01-10",
        "cargo": "perita criminal"
    },
    {
        "id": "805bccf5-cf9e-489d-8412-446cd169a0f5",
        "nome": "Júlio César Rocha",
        "dataDeIncorporacao": "2015-07-15",
        "cargo": "agente de polícia"
    },
    {
        "id": "906bccf5-cf9e-489d-8412-446cd169a0f6",
        "nome": "Vanessa Martins",
        "dataDeIncorporacao": "2012-04-03",
        "cargo": "delegada"
    }
];
*/

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


