// src/lib/wordpress-comments.js
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL =
  import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://cms.vinylstation.es/graphql';

/**
 * Obtener comentarios de un post
 */
export async function getCommentsByPost(postId) {
  console.log(`💬 Obteniendo comentarios del post ID: ${postId}`);
  
  const QUERY = gql`
    query GetCommentsByPost($postId: ID!) {
      post(id: $postId, idType: DATABASE_ID) {
        comments(first: 100, where: { orderby: COMMENT_DATE, order: DESC }) {
          nodes {
            id
            databaseId
            content
            date
            author {
              node {
                name
                email
                avatar {
                  url
                }
              }
            }
            parentId
          }
        }
      }
    }
  `;

  try {
    const { post } = await request(WORDPRESS_GRAPHQL_URL, QUERY, { 
      postId: postId.toString() 
    });
    
    const comments = post?.comments?.nodes || [];
    console.log(`✅ Obtenidos ${comments.length} comentarios`);
    
    return comments.map(comment => ({
      id: comment.databaseId,
      content: comment.content,
      date: comment.date,
      author: {
        name: comment.author?.node?.name || 'Anónimo',
        email: comment.author?.node?.email,
        avatar: comment.author?.node?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.node?.name || 'A')}&background=ff3333&color=fff`
      },
      parentId: comment.parentId
    }));
  } catch (error) {
    console.error('❌ Error obteniendo comentarios:', error.message);
    return [];
  }
}

/**
 * Enviar un comentario nuevo
 */
export async function createComment({ postId, authorName, authorEmail, content }) {
  console.log(`💬 Creando comentario en post ID: ${postId}`);
  
  const MUTATION = gql`
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        success
        comment {
          id
          databaseId
          content
          date
          author {
            node {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const { createComment: result } = await request(WORDPRESS_GRAPHQL_URL, MUTATION, {
      input: {
        clientMutationId: `comment-${Date.now()}`,
        commentOn: parseInt(postId),
        content: content,
        author: authorName,
        authorEmail: authorEmail
      }
    });
    
    console.log('✅ Comentario creado exitosamente');
    return {
      success: true,
      comment: result.comment
    };
  } catch (error) {
    console.error('❌ Error creando comentario:', error.message);
    throw new Error('Error al enviar el comentario. Por favor intenta de nuevo.');
  }
}

export default {
  getCommentsByPost,
  createComment
};
