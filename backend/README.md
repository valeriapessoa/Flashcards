# Backend do Aplicativo Flashcards

Este é o backend do aplicativo Flashcards, construído com Node.js, Express, TypeScript e Prisma.

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (gerenciado pelo Supabase)
- Conta no Cloudinary para upload de imagens

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/flashcards.git
   cd flashcards/backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Faça uma cópia do arquivo `.env.example` para `.env`
   - Preencha as variáveis de ambiente necessárias

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate deploy
   ```

### Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O servidor será iniciado em `http://localhost:5000` por padrão.

### Produção

Para construir e executar em produção:

```bash
# Construir o projeto
npm run build

# Iniciar o servidor
npm start
```

## 🔧 Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta em que o servidor irá rodar | `5000` |
| `DATABASE_URL` | URL de conexão com o banco de dados PostgreSQL | `postgresql://user:password@host:port/db` |
| `JWT_SECRET` | Chave secreta para assinatura de tokens JWT | `sua_chave_secreta` |
| `NEXTAUTH_SECRET` | Chave secreta para o NextAuth | `sua_chave_secreta` |
| `NEXTAUTH_URL` | URL base da aplicação | `http://localhost:3000` |
| `FRONTEND_URL` | URL do frontend (para CORS) | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Nome da conta no Cloudinary | `sua_conta` |
| `CLOUDINARY_API_KEY` | Chave de API do Cloudinary | `sua_chave` |
| `CLOUDINARY_API_SECRET` | Segredo da API do Cloudinary | `seu_segredo` |

## 🛠️ Tecnologias

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado do JavaScript
- **Prisma** - ORM para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em token
- **Cloudinary** - Armazenamento de mídia

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
