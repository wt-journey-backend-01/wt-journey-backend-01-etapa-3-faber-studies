const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController.js');

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Endpoints para gerenciar agentes do departamento de polícia
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna todos os agentes (com opção de filtro e ordenação)
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Filtra os agentes pelo cargo (ex.: delegado, inspetor)
 *         example: delegado
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Ordena os agentes por data de incorporação. Use `dataDeIncorporacao` (ascendente)
 *           ou `-dataDeIncorporacao` (descendente)
 *         example: -dataDeIncorporacao
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   dataDeIncorporacao:
 *                     type: string
 *                     example: 2020-01-01
 *                   cargo:
 *                     type: string
 *                     example: delegado
 */
router.get('/agentes', agentesController.getAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente específico pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
 *         schema:
 *           type: integer
 *           format: id
 *           example: 1
 *     responses:
 *       200:
 *         description: Agente retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   example: Rommel Carneiro
 *                 dataDeIncorporacao:
 *                   type: string
 *                   example: 1992-10-04
 *                 cargo:
 *                   type: string
 *                   example: delegado
 *       400:
 *         description: ID mal formatado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID mal formatado
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Agente não encontrado
 */
router.get('/agentes/:id', agentesController.getAgentById);


/**
 * @swagger
 * /agentes/{id}/casos:
 *   get:
 *     summary: Lista todos os casos atribuídos a um agente específico
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Casos do agente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   titulo:
 *                     type: string
 *                     example: Roubo de veículo
 *                   descricao:
 *                     type: string
 *                     example: Veículo furtado em via pública.
 *                   status:
 *                     type: string
 *                     enum: [aberto, solucionado]
 *                     example: aberto
 *                   agente_id:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: ID do agente inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID inválido. O ID deve ser um número inteiro.
 *       404:
 *         description: Nenhum caso encontrado para este agente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum caso encontrado para este agente.
 */
router.get('/agentes/:id/casos', agentesController.getCasesByAgent);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cadastra um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               dataDeIncorporacao:
 *                 type: string
 *                 example: 2020-01-01
 *               cargo:
 *                 type: string
 *                 example: delegado
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/agentes', agentesController.addNewAgent);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Atualizado
 *               dataDeIncorporacao:
 *                 type: string
 *                 example: 2021-06-30
 *               cargo:
 *                 type: string
 *                 example: delegado
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Requisição inválida ou dados mal formatados
 *       404:
 *         description: Agente não encontrado
 */
router.put('/agentes/:id', agentesController.updateAgent);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Atualizado Parcial
 *               dataDeIncorporacao:
 *                 type: string
 *                 example: 2022-02-22
 *               cargo:
 *                 type: string
 *                 example: inspetor
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Requisição inválida ou dados mal formatados
 *       404:
 *         description: Agente não encontrado
 */
router.patch('/agentes/:id', agentesController.patchAgent);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Agente removido com sucesso (sem corpo na resposta)
 *       400:
 *         description: ID mal formatado
 *       404:
 *         description: Agente não encontrado
 */
router.delete('/agentes/:id', agentesController.deleteAgent);

module.exports = router;