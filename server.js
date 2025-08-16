const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger.js');
const agentsRouter = require('./routes/agentesRoutes.js');
const casesRouter = require('./routes/casosRoutes.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(agentsRouter);
app.use(casesRouter);

app.get('/docs.json', (req, res) => {
    res.json(swaggerDocs);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    swaggerOptions: {
        url: '/docs',
    },
}));

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost: ${PORT}`);
});
