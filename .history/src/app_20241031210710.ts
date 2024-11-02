import express, { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

// Middleware para parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir a pasta pública
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do cliente PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'dbii9',
  password: 'root',
  port: 5432,
});

// Conectar ao banco de dados
client.connect()
  .then(() => console.log('Conectado ao PostgreSQL'))
  .catch(err => console.error('Erro de conexão', err.stack));

// Rota para criar um usuário
app.post('/api/usuarios', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await client.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar usuário');
  }
});

// Rota para login de usuário
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).send('Email ou senha incorretos');
    }

    const usuario = result.rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    
    if (!match) {
      return res.status(401).send('Email ou senha incorretos');
    }

    res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao realizar login');
  }
});

// Outras rotas...

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
