// src/app.js
const express = require('express');
const app = express();

// variável nunca usada
let variavelInutil = 123;

// função nunca usada
function funcaoNaoUsada() {
  console.log("Isso nunca vai ser chamado");
}

// rota principal
app.get('/', (req, res) => res.send('Olá Mundo'));

// exporta o app para testes
module.exports = app;

// se quiser rodar normalmente:
if (require.main === module) {
  app.listen(3000, () => console.log('Servidor rodando'));
}
