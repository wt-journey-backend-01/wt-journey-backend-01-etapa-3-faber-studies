/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Limpa a tabela de casos
  await knex('casos').del();
  
  // Consulta os IDs dos agentes que já foram inseridos
  const agentes = await knex('agentes').select('id');
  const agentesIds = agentes.map(agente => agente.id);

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