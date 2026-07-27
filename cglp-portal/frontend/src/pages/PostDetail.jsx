import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    client.get(`/posts/${slug}`).then((res) => setPost(res.data)).catch(() => setPost(false));
  }, [slug]);

  if (post === null) return <div className="max-w-3xl mx-auto px-5 py-20">Loading…</div>;
  if (post === false) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <p>Post not found.</p>
        <Link to="/news" className="text-guava-dark font-semibold hover:underline">Back to news</Link>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-5 py-16">
      <Link to="/news" className="text-sm text-forest-dark/60 hover:text-guava-dark">← All news</Link>
      <div className="h-2 w-16 rounded-full my-5" style={{ backgroundColor: post.cover_color }} />
      <div className="text-xs font-mono text-forest-dark/50 mb-2">{post.published_at}</div>
      <h1 className="font-display text-4xl text-forest-dark mb-6">{post.title}</h1>
      <p className="text-forest-dark/70 leading-relaxed">{post.content}</p>
    </section>
  );
}
