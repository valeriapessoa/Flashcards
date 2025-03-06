import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AuthForm from '../../components/AuthForm';

const AuthPage = () => {
  return (
    <div>
      <AuthForm />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AuthPage;