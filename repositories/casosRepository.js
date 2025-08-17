const db = require('../db/db.js');


async function allCases(){
    try {
        const cases = await db('casos').select('*');
        return cases;
    } catch (error) {
        throw new Error('Não foi possível buscar os casos.');
    }
}

async function caseById(id) {
    try {
        const case_ = await db('casos').where('id', id).first();
        if (!case_) {
            return null;
        }
        return case_;
    } catch (error) {
        throw new Error('Não foi possível buscar o caso.');
    }
}

async function caseByAgentId(id) {
    try {
        const cases = await db('casos').where('agente_id', id).select('*');
        if (!cases) {
            return null;
        }
        return cases;

    } catch (error) {
        throw new Error('Não foi possível buscar o caso.');
    }
}

async function casesByStatus(status) {
    try {
        const cases = await db('casos').where('status', status).select('*');
        if (!cases) {
            return null;
        }
        return cases;
    } catch (error) {
        throw new Error('Não foi possível buscar os casos por status.');
    }
}

async function agentByCase(caseId) {
    try {
        const result = await db('casos')
        .select('agentes.*') // Seleciono todas as colunas da tabela agentes
        .join('agentes', 'casos.agente_id','=','agentes.id') // faço o join
        .where('casos.id', caseId) // filtro pelo ID do caso
        .first(); // Retorno apenas o primeiro resultado

        if (!result) {
            return null;
        }

        return result;
    } catch (error) {
        throw new Error('Não foi possível buscar o agente responsável pelo caso.');
    }
}

async function addNewCaseOnRepo(newCase){
    try { 
        const [caseCreated] = await db('casos').insert(newCase).returning('*');
        return caseCreated;
    } catch (error) {
        throw new Error('Não foi possível adicionar o novo caso.');
    }
}

async function updateCaseOnRepo(id, newData) {
    try {
        const [updatedCase] = await db('casos').where('id', id).update(newData).returning('*');
        if (!updatedCase) {
            return null;
        }
        return updatedCase;
    } catch (error) {
        throw new Error('Não foi possível atualizar o caso.');
    }

}

async function patchCaseOnRepo(id, updates) {
    try {
        const [patchedCase] = await db('casos').where('id', id).update(updates).returning('*');
        if (!patchedCase) {
            return null;
        }
        return patchedCase;
    } catch (error) {
        throw new Error('Não foi possível atualizar o caso.');
    }
}

async function deleteCaseOnRepo(id) {
    try {
        const deleteRows = await db('casos').where('id', id).del();
        return deleteRows;
    } catch (error) {
        throw new Error('Não foi possível deletar o caso.');
    }
}

module.exports = {
    allCases,
    caseById,
    caseByAgentId,
    casesByStatus,
    agentByCase,
    addNewCaseOnRepo,
    updateCaseOnRepo,
    patchCaseOnRepo,
    deleteCaseOnRepo
}
