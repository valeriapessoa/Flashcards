import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const AuthPage = async () => {
  const session = await getSession();

  if (session) {
    redirect('/'); 
  } else {
    redirect('/login');
  }

  return null; 
};

export default AuthPage;