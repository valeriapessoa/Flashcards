import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { VerifyFunction } from 'passport-local'; 
import bcrypt from 'bcryptjs';
import prisma from '../libs/prismaClient'; 

// Configuração da Estratégia Local
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    // Usar a assinatura correta para a função verify
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Passa a mensagem como terceiro argumento (options)
          return done(null, false, { message: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          // Passa a mensagem como terceiro argumento (options)
          return done(null, false, { message: 'Senha incorreta.' });
        }

        // Autenticação bem-sucedida
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);


passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Desserializa o usuário a partir do ID armazenado
passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false | null) => void) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    // O segundo argumento de done deve ser o usuário ou false/null
    done(null, user);
  } catch (error) {
    done(error, false); // Passa false em caso de erro ao buscar usuário
  }
});

