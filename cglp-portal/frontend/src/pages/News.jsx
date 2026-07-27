import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function News() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.get('/posts').then((res) => setPosts(res.data));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl text-forest-dark mb-8">News &amp; Updates</h1>
      <div className="space-y-4">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/news/${p.slug}`}
            className="flex gap-4 items-center bg-white/60 border border-forest/10 rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="w-2 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: p.cover_color }} />
            <div>
              <div className="text-xs font-mono text-forest-dark/50">{p.published_at}</div>
              <h2 className="font-display text-lg text-forest-dark">{p.title}</h2>
              <p className="text-sm text-forest-dark/60">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
