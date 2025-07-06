import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { blogPosts } from './posts';

const Blog: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Helmet>
        <title>Blog | Mandar Whats - Dicas e Tutoriais sobre WhatsApp</title>
        <meta name="description" content="Blog com dicas, tutoriais e informações sobre como usar o WhatsApp de forma eficiente para negócios, vendas e comunicação. Aprenda sobre envio em massa, automação e ferramentas gratuitas." />
        <link rel="canonical" href="https://mandarwhats.com.br/blog" />
        <meta property="og:title" content="Blog | Mandar Whats - Dicas e Tutoriais sobre WhatsApp" />
        <meta property="og:description" content="Blog com dicas, tutoriais e informações sobre como usar o WhatsApp de forma eficiente para negócios, vendas e comunicação." />
        <meta property="og:url" content="https://mandarwhats.com.br/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog | Mandar Whats - Dicas e Tutoriais sobre WhatsApp" />
        <meta name="twitter:description" content="Blog com dicas, tutoriais e informações sobre como usar o WhatsApp de forma eficiente para negócios, vendas e comunicação." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>
      <div className="grid gap-8">
        {blogPosts.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 hover:border-green-400"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={post.image} alt="Capa" className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{post.date} • {post.readTime}</p>
                <p className="text-gray-700 text-base">{post.description}</p>
                <span className="inline-block mt-2 text-green-600 font-medium">Ler mais →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog; 