import express, { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Client } from 'pg';

const app = express();
const PORT = 3000;

// Definir a pasta pública
app.use(express.static(path.join(__dirname, 'public')));

// Definir os caminhos para os PDFs de Entrada e Saída
const entradaFolderPath = path.join(__dirname, 'pdfs', 'entrada');
const saidaFolderPath = path.join(__dirname, 'pdfs', 'saida');

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
  .catch((err: { stack: any; }) => console.error('Erro de conexão', err.stack));

// Rota para servir dados de entrada do banco de dados
app.get('/api/entrada1', async (req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT * FROM entrada'); // Substitua pelo seu comando SQL
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar dados de entrada');
  }
});

// Rota para servir dados de saída do banco de dados
app.get('/api/saida1', async (req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT * FROM saida'); // Substitua pelo seu comando SQL
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar dados de saída');
  }
});

// Rota para listar arquivos PDF de Entrada
app.get('/api/pdfs/entrada', (req: Request, res: Response) => {
  fs.readdir(entradaFolderPath, (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao ler os arquivos de entrada');
    }
    res.json(files.filter(file => file.endsWith('.pdf')));
  });
});

// Rota para listar arquivos PDF de Saída
app.get('/api/pdfs/saida', (req: Request, res: Response) => {
  fs.readdir(saidaFolderPath, (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao ler os arquivos de saída');
    }
    res.json(files.filter(file => file.endsWith('.pdf')));
  });
});

// Rota para servir os PDFs de Entrada
app.get('/pdfs/entrada/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(entradaFolderPath, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Arquivo não encontrado');
  }
});

// Rota para servir os PDFs de Saída
app.get('/pdfs/saida/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(saidaFolderPath, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Arquivo não encontrado');
  }
});

// Rota para exibir a página principal
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para exibir a página de entrada
app.get('/entrada1', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'entrada1.html'));
});

// Rota para exibir a página de saída
app.get('/saida1', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'saida1.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});