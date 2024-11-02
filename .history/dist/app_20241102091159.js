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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const pg_1 = require("pg");
const bcrypt_1 = __importDefault(require("bcrypt"));

const app = (0, express_1.default)();
const PORT = 3000;

// Configurar o middleware para receber JSON
app.use(express_1.default.json());
// Definir a pasta pública
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Definir os caminhos para os PDFs de Entrada e Saída
const entradaFolderPath = path.join(__dirname, 'pdfs', 'entrada');
const saidaFolderPath = path.join(__dirname, 'pdfs', 'saida');

app.use(bodyParser.json());



// Configuração do cliente PostgreSQL
const client = new pg_1.Client({
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
// Rota para criar um novo usuário

app.post('/api/usuarios', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, senha } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(senha, 10);
        const result = yield client.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *', [nome, email, hashedPassword]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar usuário');
    }
}));
// Rota para servir dados de entrada do banco de dados
app.get('/api/entrada1', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query('SELECT * FROM entrada'); // Substitua pelo seu comando SQL
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).send('Erro ao buscar dados de entrada');
    }
}));
// Rota para servir dados de saída do banco de dados
app.get('/api/saida1', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query('SELECT * FROM saida'); // Substitua pelo seu comando SQL
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).send('Erro ao buscar dados de saída');
    }
}));
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
app.get('/pdfs/entrada/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(entradaFolderPath, filename);
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
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Arquivo não encontrado');
    }
});
// Rota para exibir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rota para exibir a página de entrada
app.get('/entrada1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'entrada1.html'));
});
// Rota para exibir a página de saída
app.get('/saida1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'saida1.html'));
});
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}`);
});
