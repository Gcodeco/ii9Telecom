import express, { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
const PORT = 3000;

// Definir a pasta pública (caso queira servir arquivos estáticos como HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Definir os caminhos para os PDFs de Entrada e Saída
const entradaFolderPath = path.join(__dirname, 'pdfs', 'entrada');
const saidaFolderPath = path.join(__dirname, 'pdfs', 'saida');

// Rota para servir o arquivo JSON de dados de entrada
app.get('/api/entrada1', (req: Request, res: Response) => {
  const caminhoArquivo = path.join(__dirname, 'dados', 'entradajunho.json');

  // Lê o arquivo JSON e envia como resposta
  fs.readFile(caminhoArquivo, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo JSON de entrada');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Rota para servir o arquivo JSON de saída
app.get('/api/saida1', (req: Request, res: Response) => {
  const caminhoArquivo = path.join(__dirname, 'dados', 'saidajunho.json');

  // Lê o arquivo JSON e envia como resposta
  fs.readFile(caminhoArquivo, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo JSON de saída');
      return;
    }
    res.json(JSON.parse(data));
  });
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

  // Verifica se o arquivo existe e serve
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

  // Verifica se o arquivo existe e serve
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Arquivo não encontrado');
  }
});

// Rota para exibir a página principal (index.html)
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para exibir a página de entrada (entrada.html)
app.get('/entrada1', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'entrada1.html'));
});

// Rota para exibir a página de saída (saida.html)
app.get('/saida1', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'saida1.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
