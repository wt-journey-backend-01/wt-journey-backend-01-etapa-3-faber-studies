const cases = [
    {
        "id": "7f1d1566-a232-4360-b844-312c74bc283a",
        "titulo": "homicídio",
        "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        "status": "aberto",
        "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1"
    },
    {
        "id": "e3930bb1-79e1-44ff-a89f-a8be2cd371ca",
        "titulo": "furto",
        "descricao": "Relato de furto de veículo na região central da cidade, ocorrido na madrugada do dia 11/07/2007.",
        "status": "em andamento",
        "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1"
    },
    {
        "id": "1a90e363-a8b9-423c-ab68-f6a90bce09c1",
        "titulo": "roubo",
        "descricao": "Roubo a mão armada registrado no bairro Centro, às 14:20 do dia 12/07/2007.",
        "status": "fechado",
        "agente_id": "502bccf5-cf9e-489d-8412-446cd169a0f2"
    },
    {
        "id": "e0db279d-2fc5-4c63-93da-320a3605800b",
        "titulo": "sequestro",
        "descricao": "Caso de sequestro registrado no bairro Jardim, com a vítima sendo libertada após negociação com os sequestradores.",
        "status": "aberto",
        "agente_id": "805bccf5-cf9e-489d-8412-446cd169a0f5"
    },
    {
        "id": "f3b940af-f5f3-4ae3-b9d0-69c50315cde8",
        "titulo": "tráfico de drogas",
        "descricao": "Operação policial resultou na apreensão de substâncias ilícitas no bairro Nova Esperança.",
        "status": "em andamento",
        "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1"
    },
    {
        "id": "bdb3811b-7c39-4693-a68a-ca3a281b5414",
        "titulo": "assalto a banco",
        "descricao": "Assalto a banco ocorrido no centro da cidade, onde os criminosos foram identificados e estão sendo rastreados.",
        "status": "aberto",
        "agente_id": "906bccf5-cf9e-489d-8412-446cd169a0f6"
    },
    {
        "id": "df5df6d9-f824-4741-9aab-cfa869392e7f",
        "titulo": "fraude bancária",
        "descricao": "Investigação sobre um esquema de fraude bancária envolvendo vários suspeitos.",
        "status": "em andamento",
        "agente_id": "502bccf5-cf9e-489d-8412-446cd169a0f2"
    },
    {
        "id": "41c3f81e-e522-410a-b04f-0196e7de2363",
        "titulo": "vandalismo",
        "descricao": "Atos de vandalismo em prédios públicos na região sul da cidade, com suspeitos sendo investigados.",
        "status": "fechado",
        "agente_id": "603bccf5-cf9e-489d-8412-446cd169a0f3"
    },
    {
        "id": "1319fbfb-1a66-4532-aaea-fb85345dcc34",
        "titulo": "extorsão",
        "descricao": "Caso de extorsão envolvendo uma empresa local, com suspeitos já identificados.",
        "status": "aberto",
        "agente_id": "704bccf5-cf9e-489d-8412-446cd169a0f4"
    },
    {
        "id": "800a2996-7886-4fdb-b07e-7f0cccffa169",
        "titulo": "assassinato",
        "descricao": "Investigação de um assassinato ocorrido no bairro Alto, com suspeitos sendo interrogados.",
        "status": "em andamento",
        "agente_id": "805bccf5-cf9e-489d-8412-446cd169a0f5"
    },
    {
        "id": "de2314ff-4386-4ea4-8949-6bc154fca196",
        "titulo": "sequestro relâmpago",
        "descricao": "Caso de sequestro relâmpago registrado no bairro Jardim das Flores, com a vítima já liberada.",
        "status": "fechado",
        "agente_id": "906bccf5-cf9e-489d-8412-446cd169a0f6"
    },
    {
        "id": "2ddc4de3-42da-41e4-bd87-0bc1e59432e2",
        "titulo": "hacking",
        "descricao": "Investigação sobre um ataque cibernético a uma empresa de tecnologia local.",
        "status": "aberto",
        "agente_id": "805bccf5-cf9e-489d-8412-446cd169a0f5"
    }
];

function allCases(){
    return cases;
}

function caseById(id) {
    return cases.find(c => c.id === id);
}

function addNewCaseOnRepo(newCase){
    cases.push(newCase);
    return newCase;
}

function updateCaseOnRepo(id, newData) {
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) {
        return null
    }
    return cases[index] = {id, ...newData};
}

function patchCaseOnRepo(id, updates) {
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) {
        return null
    }

    return cases[index] = {...cases[index], ...updates}
}

function deleteCaseOnRepo(id) {
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) {
        return false;
    }
    cases.splice(index, 1);
    return true;
}

module.exports = {
    allCases,
    caseById,
    addNewCaseOnRepo,
    updateCaseOnRepo,
    patchCaseOnRepo,
    deleteCaseOnRepo
}
