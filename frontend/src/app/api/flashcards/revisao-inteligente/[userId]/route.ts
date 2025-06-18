import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Você precisa estar logado para acessar esta funcionalidade.' },
        { status: 401 }
      );
    }

    // Verificar se o usuário está tentando acessar seus próprios flashcards
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Você só pode acessar seus próprios flashcards.' },
        { status: 403 }
      );
    }

    // Encaminha a requisição para o backend
    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/flashcards/revisao-inteligente/${userId}`;
    const res = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Adicione aqui headers de autenticação, se necessário
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar flashcards para revisão:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar flashcards para revisão.' },
      { status: 500 }
    );
  }
}
