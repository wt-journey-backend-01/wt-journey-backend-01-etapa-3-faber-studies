/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Limpa a tabela de agentes
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

  await knex('agentes').insert(agentesData);
};