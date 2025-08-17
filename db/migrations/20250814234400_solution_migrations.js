/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('agentes', (table) => {
      table.increments('id').primary();
      table.string('nome', 50).notNullable();
      table.date('dataDeIncorporacao').notNullable();
      table.string('cargo', 50).notNullable();
    })
    .createTable('casos', (table) => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table.text('descricao').notNullable();
      table.enu('status', ['aberto', 'em andamento', 'fechado']).notNullable();
      table
        .integer('agente_id')
        .unsigned() // irrelevante no Postgres, mas ok
        .notNullable()
        .references('id')
        .inTable('agentes')
        .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('casos')
    .dropTableIfExists('agentes');
};
