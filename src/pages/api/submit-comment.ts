// src/pages/api/submit-comment.ts
import type { APIRoute } from 'astro';
import { createComment } from '../../lib/wordpress-comments';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validar datos
    if (!data.postId || !data.authorName || !data.authorEmail || !data.content) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Faltan datos requeridos'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.authorEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email inválido'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Crear comentario
    const result = await createComment({
      postId: data.postId,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      content: data.content
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comentario enviado exitosamente',
        comment: result.comment
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en API submit-comment:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al procesar el comentario'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
