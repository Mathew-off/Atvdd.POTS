const express = require('express');

const app = express();
const PORT = 3000;

// Permite ler o corpo das requisições em JSON
app.use(express.json());

// "Banco de dados" em memória
const alunos = [
  { id: 1, nome: 'Ana', curso: 'Computação' },
  { id: 2, nome: 'Pedro', curso: 'Sistemas de Informação' },
];

// Estratégia de IDs únicos: contador incremental.
// Não usamos alunos.length + 1 porque, após uma exclusão, isso
// poderia gerar um ID repetido. O contador nunca volta atrás.
let proximoId = 3;

// Verifica se um valor é uma string preenchida (não vazia)
const textoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';

// GET /alunos - lista todos
app.get('/alunos', (req, res) => {
  res.status(200).json(alunos);
});

// GET /alunos/:id - busca um aluno
app.get('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.status(200).json(aluno);
});

// POST /alunos - cadastra um aluno
app.post('/alunos', (req, res) => {
  const { nome, curso } = req.body || {};

  if (!textoValido(nome) || !textoValido(curso)) {
    return res.status(400).json({ erro: 'Os campos nome e curso são obrigatórios' });
  }

  const novoAluno = { id: proximoId++, nome: nome.trim(), curso: curso.trim() };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// PUT /alunos/:id - atualiza nome e curso
app.put('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const { nome, curso } = req.body || {};

  if (!textoValido(nome) || !textoValido(curso)) {
    return res.status(400).json({ erro: 'Os campos nome e curso são obrigatórios' });
  }

  aluno.nome = nome.trim();
  aluno.curso = curso.trim();
  res.status(200).json(aluno);
});

// DELETE /alunos/:id - remove um aluno
app.delete('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  alunos.splice(indice, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});