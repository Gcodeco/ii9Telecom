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




const express = require("express");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Configuração da pool de conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',          // Substitua pelo seu usuário do banco
    host: 'localhost',             // Substitua pelo host do banco
    database: 'dbii9',         // Substitua pelo nome do seu banco
    password: 'root',         // Substitua pela senha do banco
    port: 5432,                    // Porta padrão do PostgreSQL
});

// Configurar o middleware para receber JSON
app.use(express.json());

// Definir a pasta pública
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));


// Caminhos para pastas de PDFs
const entradaFolderPath = path.join(__dirname, "pdfs", "entrada");
const saidaFolderPath = path.join(__dirname, "pdfs", "saida");

 

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log(`Tentativa de login com email: ${email}`);

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
        }

        const match = await bcrypt.compare(senha, usuario.senha);
        if (!match) {
            console.log('Senha incorreta');
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
        }

        res.json({ success: true, message: `Bem-vindo, ${user.nome}!` });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});


const bcrypt = require('bcrypt');

const senha = 'Codeco3691'; // A senha que você deseja hashear
const saltRounds = 10; // Número de rounds de sal

bcrypt.hash(senha, saltRounds, function(err, hash) {
    console.log(hash); // Use este hash no seu INSERT
});


// Rota para listar arquivos PDF de Entrada
app.get("/api/pdfs/entrada", (req, res) => {
    fs.readdir(entradaFolderPath, (err, files) => {
        if (err) {
            return res.status(500).send("Erro ao ler os arquivos de entrada");
        }
        res.json(files.filter(file => file.endsWith(".pdf")));
    });
});

// Rota para listar arquivos PDF de Saída
app.get("/api/pdfs/saida", (req, res) => {
    fs.readdir(saidaFolderPath, (err, files) => {
        if (err) {
            return res.status(500).send("Erro ao ler os arquivos de saída");
        }
        res.json(files.filter(file => file.endsWith(".pdf")));
    });
});

// Rota para servir os PDFs de Entrada
app.get("/pdfs/entrada/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(entradaFolderPath, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Arquivo não encontrado");
    }
});

// Rota para servir os PDFs de Saída
app.get("/pdfs/saida/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(saidaFolderPath, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Arquivo não encontrado");
    }
});

// Rota para exibir a página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para exibir a página de entrada
app.get("/entrada1", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "entrada1.html"));
});

// Rota para exibir a página de saída
app.get("/saida1", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "saida1.html"));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}`);
});
