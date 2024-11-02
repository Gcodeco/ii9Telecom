const express = require("express");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Configuração da pool de conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',          // Substitua pelo seu usuário do banco
    host: 'localhost',             // Substitua pelo host do banco
    database: 'seu_banco',         // Substitua pelo nome do seu banco
    password: 'sua_senha',         // Substitua pela senha do banco
    port: 5432,                    // Porta padrão do PostgreSQL
});

// Configurar o middleware para receber JSON
app.use(express.json());

// Definir a pasta pública
app.use(express.static(path.join(__dirname, "public")));

// Caminhos para pastas de PDFs
const entradaFolderPath = path.join(__dirname, "pdfs", "entrada");
const saidaFolderPath = path.join(__dirname, "pdfs", "saida");

// Função de login de usuário
async function loginUser(email: any, senha: any) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            throw new Error("Usuário não encontrado.");
        }

        const user = result.rows[0];

        // Comparação da senha informada com a senha armazenada (hash)
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        
        if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
        }

        return { success: true, message: `Bem-vindo, ${user.nome}!` };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Rota de login
app.post("/api/login", async (req: { body: { email: any; senha: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; json: (arg0: { nome: any; }) => void; }) => {
    const { email, senha } = req.body;

    try {
        const user = await loginUser(email, senha);

        if (!user.success) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        res.json({ nome: user.message });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Rota para listar arquivos PDF de Entrada
app.get("/api/pdfs/entrada", (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; json: (arg0: any) => void; }) => {
    fs.readdir(entradaFolderPath, (err: any, files: any[]) => {
        if (err) {
            return res.status(500).send("Erro ao ler os arquivos de entrada");
        }
        res.json(files.filter(file => file.endsWith(".pdf")));
    });
});

// Rota para listar arquivos PDF de Saída
app.get("/api/pdfs/saida", (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; json: (arg0: any) => void; }) => {
    fs.readdir(saidaFolderPath, (err: any, files: any[]) => {
        if (err) {
            return res.status(500).send("Erro ao ler os arquivos de saída");
        }
        res.json(files.filter((file: string) => file.endsWith(".pdf")));
    });
});

// Rota para servir os PDFs de Entrada
app.get("/pdfs/entrada/:filename", (req: { params: { filename: any; }; }, res: { sendFile: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    const filename = req.params.filename;
    const filePath = path.join(entradaFolderPath, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Arquivo não encontrado");
    }
});

// Rota para servir os PDFs de Saída
app.get("/pdfs/saida/:filename", (req: { params: { filename: any; }; }, res: { sendFile: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    const filename = req.params.filename;
    const filePath = path.join(saidaFolderPath, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Arquivo não encontrado");
    }
});

// Rota para exibir a página principal
app.get("/", (req: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para exibir a página de entrada
app.get("/entrada1", (req: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(__dirname, "public", "entrada1.html"));
});

// Rota para exibir a página de saída
app.get("/saida1", (req: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(__dirname, "public", "saida1.html"));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}`);
});
