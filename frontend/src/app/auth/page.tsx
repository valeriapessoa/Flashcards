import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const AuthPage = async () => {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return null; // Página AuthPage não renderiza nada visualmente
};

export default AuthPage;