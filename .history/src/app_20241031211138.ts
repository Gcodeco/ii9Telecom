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

    // Login bem-sucedido
    res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao realizar login');
  }
});
