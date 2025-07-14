# 🚀 FlashCards - Plataforma de Estudo Inteligente

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![OAuth](https://img.shields.io/badge/OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://oauth.net/)


## 🌐 Link do Site
🔗 **Acesse o site:** [Flashcards App](https://flashcards-vall-app.vercel.app/)

## 📝 Descrição

O **Flashcards** é uma plataforma inovadora de aprendizado baseada no método de repetição espaçada, projetada para ajudar estudantes e profissionais a maximizarem sua eficiência de estudo. Com um algoritmo de revisão inteligente, o sistema prioriza automaticamente os flashcards que precisam de mais atenção, baseando-se no desempenho individual de cada usuário.

## ✨ Destaques Técnicos

### 🏗️ Arquitetura
- **Frontend**: Aplicação Next.js 15+ com App Router para renderização híbrida (SSR/SSG/ISR)
- **Backend**: API RESTful com Node.js e Express
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js com suporte a múltiplos provedores (Google, Facebook, Email/Senha)
- **UI/UX**: Material UI (MUI) com design responsivo
- **Gerenciamento de Estado**: React Query para sincronização eficiente de dados
- **Upload de Imagens**: Integração com Cloudinary

### 🛠️ Tecnologias Principais
- **Frontend**: Next.js 15, TypeScript, React 18, Material UI, React Query, NextAuth.js
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT
- **Autenticação Social**: OAuth 2.0, JWT, NextAuth.js, Google OAuth, Facebook Login
- **Ferramentas**: ESLint, Prettier, Husky, Git

## 🎯 Recursos Principais

### 🔐 Autenticação Avançada
- **Login Social**:
  - Autenticação via Google OAuth
  - Autenticação via Facebook Login
  - Cadastro tradicional com e-mail/senha
- **Gerenciamento de Sessão Segura**
- **Proteção de Rotas**
- **Token JWT para Autenticação Stateless**

### 📚 Sistema de Flashcards
- Criação e edição de flashcards com suporte a texto e imagens
- Organização por categorias e tags personalizáveis
- Interface intuitiva para revisão dos cards

### 🧠 Revisão Inteligente
- Algoritmo que prioriza flashcards com maior número de erros
- Acompanhamento de desempenho individual

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Contas de desenvolvedor no Google e Facebook para OAuth
- Conta no Cloudinary para upload de imagens
- npm ou yarn

### Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/valeriapessoa/Flashcards.git](https://github.com/valeriapessoa/Flashcards.git)
   cd flashcards
   ```

2. **Backend**
   ```bash
   cd backend
   cp .env
   # Configure as variáveis de ambiente no arquivo .env
   # Incluindo GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd ../frontend
   cp .env.local
   # Configure as variáveis de ambiente no arquivo .env.local
   # Incluindo NEXT_PUBLIC_GOOGLE_CLIENT_ID e NEXT_PUBLIC_FACEBOOK_CLIENT_ID
   npm install
   npm run dev
   ```

## 📊 Estrutura do Banco de Dados

O banco de dados foi modelado com foco em escalabilidade e desempenho, utilizando as seguintes entidades principais:

- **User**: Armazena informações dos usuários e credenciais OAuth
- **Flashcard**: Cartões de estudo criados pelos usuários
- **Tag**: Tags para classificação dos flashcards
- **Category**: Categorias para organização
- **StudySession**: Sessões de estudo dos usuários
- **StudyResult**: Resultados das sessões de estudo
- **Account**: Contas de autenticação vinculadas aos usuários (via NextAuth)


## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📸 Demonstração

### Página Inicial
![Página Inicial](/frontend/public/images/%20screens/tela-1.png)

### Criar
![Criar Flashcard](/frontend/public/images/%20screens/tela-2.png)

### Flashcards
![Criar Flashcard](/frontend/public/images/%20screens/tela-3.png)

### Editar Flashcard
![Editar Flashcard](/frontend/public/images/%20screens/tela-4.png)

### Estudar
![Estudar](/frontend/public/images/%20screens/tela-5.png)

### Estudar
![Estudar](/frontend/public/images/%20screens/tela-6.png)

### Estudar
![Estudar](/frontend/public/images/%20screens/tela-7.png)

### Revisão Inteligente
![Revisão Inteligente](/frontend/public/images/%20screens/tela-8.png)

### Login
![Login](/frontend/public/images/%20screens/tela-9.png)

### Registro
![Registro](/frontend/public/images/%20screens/tela-10.png)

---

Desenvolvido com ❤️ por [Valéria Pessoa] - [GitHub](https://github.com/valeriapessoa) | [LinkedIn](https://www.linkedin.com/in/valeriapessoa-vall/)
