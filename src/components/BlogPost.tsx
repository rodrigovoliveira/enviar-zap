import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { blogPosts } from './posts';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
        <Link to="/blog" className="text-green-600 hover:underline">Voltar para o blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Helmet>
        <title>{post.title} | Mandar Whats</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://mandarwhats.com.br/blog/${post.slug}`} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-2">{post.date} • {post.readTime}</p>
      <img src={post.image} alt="Capa" className="w-32 h-32 object-contain rounded-lg bg-gray-50 mb-6" />
      <div className="prose prose-green max-w-none mb-8 blog-content">
        {post.content}
      </div>
      <Link to="/blog" className="text-green-600 hover:underline">← Voltar para o blog</Link>
    </div>
  );
};

export default BlogPost; 