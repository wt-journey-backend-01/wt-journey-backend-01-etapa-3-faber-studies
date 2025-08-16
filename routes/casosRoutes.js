const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController.js');

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Endpoints para gerenciar Casos do departamento de polícia
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos, com possibilidade de filtros
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filtra os casos atribuídos a um agente específico
 *         example: 401bccf5-cf9e-489d-8412-446cd169a0f1
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtra os casos pelo status (aberto, em andamento ou fechado)
 *         example: aberto
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Pesquisa full-text no título ou descrição do caso
 *         example: homicídio
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 7f1d1566-a232-4360-b844-312c74bc283a
 *                   titulo:
 *                     type: string
 *                     example: homicídio
 *                   descricao:
 *                     type: string
 *                     example: Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União.
 *                   status:
 *                     type: string
 *                     example: aberto
 *                   agente_id:
 *                     type: string
 *                     example: 401bccf5-cf9e-489d-8412-446cd169a0f1
 *       400:
 *         description: Parâmetros inválidos (status ou agente_id incorretos)
 *       404:
 *         description: Nenhum caso encontrado com os filtros fornecidos
 */

router.get('/casos', casosController.getAllCases);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso pelo ID
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Caso retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: f5fb2ad5-22a8-4cb4-90f2-8733517a0d46
 *                   titulo:
 *                     type: string
 *                     example: homicídio
 *                   descricao: 
 *                     type: string           
 *                     example: Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.
 *                   status:
 *                     type: string
 *                     example: fechado
 *                   agente_id:
 *                     type: string
 *                     example: 401bccf5-cf9e-489d-8412-446cd169a0f1
 */
router.get('/casos/:id', casosController.getCaseById);

/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Retorna os dados do agente responsável por um caso específico
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do caso
 *         example: 7f1d1566-a232-4360-b844-312c74bc283a
 *     responses:
 *       200:
 *         description: Dados do agente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 401bccf5-cf9e-489d-8412-446cd169a0f1
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
 *       404:
 *         description: Caso ou agente não encontrado
 */

router.get('/casos/:id/agente', casosController.getAgentByCase)

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cadastra um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: homicidio
 *               descricao:
 *                 type: string
 *                 example: Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.
 *               status:
 *                 type: string
 *                 example: em andamento
 *               agente_id: 
 *                 type: string
 *                 example: 401bccf5-cf9e-489d-8412-446cd169a0f1                
 *  
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: ID não encontrado
 */
router.post('/casos', casosController.addNewCase);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: homicidio
 *               descricao:
 *                 type: string
 *                 example: Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.
 *               status:
 *                 type: string
 *                 example: em andamento
 *               agente_id: 
 *                 type: string
 *                 example: 401bccf5-cf9e-489d-8412-446cd169a0f1  
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Requisição inválida ou dados mal formatados
 *       404:
 *         description: Caso/Agente não encontrado
 */
router.put('/casos/:id', casosController.updateCase);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: homicidio
 *               descricao:
 *                 type: string
 *                 example: Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.
 *               status:
 *                 type: string
 *                 example: em andamento
 *               agente_id: 
 *                 type: string
 *                 example: 401bccf5-cf9e-489d-8412-446cd169a0f1 
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Requisição inválida ou dados mal formatados
 *       404:
 *         description: Caso/Agente não encontrado
 */
router.patch('/casos/:id', casosController.patchCase);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: caso removido com sucesso (sem corpo na resposta)
 *       400:
 *         description: ID mal formatado
 *       404:
 *         description: caso não encontrado
 */
router.delete('/casos/:id', casosController.deleteCase);

module.exports = router
