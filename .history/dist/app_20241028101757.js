"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
// Definir a pasta pública (caso queira servir arquivos estáticos como HTML, CSS, JS)
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Definir os caminhos para os PDFs de Entrada e Saída
const entradaFolderPath = path.join(__dirname, 'pdfs', 'entrada');
const saidaFolderPath = path.join(__dirname, 'pdfs', 'saida');
// Rota para servir o arquivo JSON de dados de entrada
app.get('/api/entrada1', (req, res) => {
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
app.get('/api/saida1', (req, res) => {
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
app.get('/api/pdfs/entrada', (req, res) => {
    fs.readdir(entradaFolderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erro ao ler os arquivos de entrada');
        }
        res.json(files.filter(file => file.endsWith('.pdf')));
    });
});
// Rota para listar arquivos PDF de Saída
app.get('/api/pdfs/saida', (req, res) => {
    fs.readdir(saidaFolderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erro ao ler os arquivos de saída');
        }
        res.json(files.filter(file => file.endsWith('.pdf')));
    });
});
// Rota para servir os PDFs de Entrada
app.get('/dist/pdfs/entrada:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(entradaFolderPath, filename);
    // Verifica se o arquivo existe e serve
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Arquivo não encontrado');
    }
});
// Rota para servir os PDFs de Saída
app.get('/pdfs/saida/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(saidaFolderPath, filename);
    // Verifica se o arquivo existe e serve
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Arquivo não encontrado');
    }
});
// Rota para exibir a página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rota para exibir a página de entrada (entrada.html)
app.get('/entrada1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'entrada1.html'));
});
// Rota para exibir a página de saída (saida.html)
app.get('/saida1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'saida1.html'));
});
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}`);
});
