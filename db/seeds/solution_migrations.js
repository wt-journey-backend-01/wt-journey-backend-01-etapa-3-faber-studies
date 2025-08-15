/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Limpa as tabelas primeiro
  await knex('casos').del();
  await knex('agentes').del();

  // Inserindo agentes de polícia
  const agentesData = [
    { nome: 'Carlos Silva', dataDeIncorporacao: '2015-03-10', cargo: 'Delegado' },
    { nome: 'Ana Paula', dataDeIncorporacao: '2018-07-22', cargo: 'Investigadora' },
    { nome: 'João Souza', dataDeIncorporacao: '2012-01-15', cargo: 'Policial Civil' },
    { nome: 'Mariana Lima', dataDeIncorporacao: '2019-11-05', cargo: 'Perita Criminal' },
    { nome: 'Ricardo Torres', dataDeIncorporacao: '2010-06-30', cargo: 'Delegado' },
    { nome: 'Fernanda Costa', dataDeIncorporacao: '2016-09-18', cargo: 'Investigadora' },
    { nome: 'Lucas Pereira', dataDeIncorporacao: '2013-12-12', cargo: 'Policial Civil' },
    { nome: 'Patrícia Gomes', dataDeIncorporacao: '2020-02-25', cargo: 'Perita Criminal' },
    { nome: 'Eduardo Rocha', dataDeIncorporacao: '2011-04-03', cargo: 'Delegado' },
    { nome: 'Juliana Martins', dataDeIncorporacao: '2017-08-14', cargo: 'Investigadora' }
  ];

  const agentesIdsObjs = await knex('agentes').insert(agentesData).returning('id');
  const agentesIds = agentesIdsObjs.map(obj => obj.id); // extrai apenas os números

  // Inserindo casos policiais
  const casosData = [
    { titulo: 'Roubo em banco', descricao: 'Assalto à agência central', status: 'aberto', agente_id: agentesIds[0] },
    { titulo: 'Tráfico de drogas', descricao: 'Operação na favela do Rio', status: 'aberto', agente_id: agentesIds[1] },
    { titulo: 'Homicídio', descricao: 'Crime ocorrido em bairro residencial', status: 'solucionado', agente_id: agentesIds[2] },
    { titulo: 'Sequestro', descricao: 'Vítima liberada após 3 dias', status: 'solucionado', agente_id: agentesIds[3] },
    { titulo: 'Fraude bancária', descricao: 'Golpe em clientes online', status: 'aberto', agente_id: agentesIds[4] },
    { titulo: 'Furto de veículos', descricao: 'Vários carros roubados na cidade', status: 'aberto', agente_id: agentesIds[5] },
    { titulo: 'Assalto a residência', descricao: 'Família feita refém', status: 'solucionado', agente_id: agentesIds[6] },
    { titulo: 'Estelionato', descricao: 'Golpes em idosos', status: 'aberto', agente_id: agentesIds[7] },
    { titulo: 'Tráfico internacional', descricao: 'Operação conjunta com a polícia federal', status: 'solucionado', agente_id: agentesIds[8] },
    { titulo: 'Incêndio criminoso', descricao: 'Queimada em depósito de produtos', status: 'aberto', agente_id: agentesIds[9] }
  ];

  await knex('casos').insert(casosData);
};
