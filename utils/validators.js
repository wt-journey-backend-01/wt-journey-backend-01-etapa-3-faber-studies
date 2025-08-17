
function validDate(date) {
    const dateOfIncorp = new Date(date);
    const today = new Date();
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/; 

    if (dateOfIncorp > today) {
        return {valid: false, error: "future date"}
    }

    if (!dataRegex.test(date)) {
        return {valid: false, error:"false format"};
    }

    return true;
}

function verifyAgentExists(id, agents) {
    return agents.some(agent => agent.id === id);
}

const validStatusesList = ['aberto', 'solucionado'];

function validStatus(status) {
    return validStatusesList.includes(status.toLowerCase());
}

module.exports = {
    validDate,
    verifyAgentExists,
    validStatusesList,
    validStatus
};