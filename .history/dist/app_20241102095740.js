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




const bcrypt = require('bcrypt');
const { pool } = require('./database'); // Certifique-se de ajustar o caminho do pool para o seu arquivo de conexão com o banco

async function loginUser(email, senha) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        const user = result.rows[0];

        // Comparação da senha informada com a senha armazenada (hash)
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        
        if (!isPasswordValid) {
            throw new Error('Senha incorreta.');
        }

        // Caso o login seja bem-sucedido
        return { success: true, message: `Bem-vindo, ${user.nome}!` };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { loginUser };



// Conectar ao banco de dados
client.connect()
    .then(() => console.log('Conectado ao PostgreSQL'))
    .catch(err => console.error('Erro de conexão', err.stack));

    app.post('/api/login', async (req, res) => {
        const { email, senha } = req.body;
    
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
    
            if (!user) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
    
            // Here you should verify the password
            // Assuming you are using bcrypt to hash passwords
            const bcrypt = require('bcrypt');
            const match = await bcrypt.compare(senha, user.senha); // Compare hashed password
    
            if (!match) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
    
            // If successful, return user data (omit password)
            res.json({ nome: user.nome }); // Assuming your user table has a 'nome' field
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    const bcrypt = require('bcrypt');

async function createUser(nome, email, senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    await pool.query('INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, hashedPassword]);
}

    

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
