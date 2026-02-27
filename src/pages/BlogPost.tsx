import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ExternalLink, ArrowLeft } from 'lucide-react';
import { getBlogBySlug } from '../services/firebase/blogService';
import type { Blog } from '../types';
import { colors } from '../config/colors';
import LoadingSpinner from '../components/common/LoadingSpinner';

/** Minimal HTML sanitizer for blog description: allow safe tags only, strip scripts and event handlers. */
function sanitizeHtml(html: string): string {
  if (!html || !html.trim()) return '';
  const allowedTags = ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'span', 'div', 'blockquote'];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const all = Array.from(doc.body.querySelectorAll('*'));
  const byDepth = all.sort((a, b) => {
    const d = (e: Element) => e.querySelectorAll('*').length;
    return d(b) - d(a);
  });
  byDepth.forEach((el) => {
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...Array.from(el.childNodes));
    }
  });
  doc.body.querySelectorAll('*').forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'a') {
      const href = el.getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      }
    }
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on') || attr.name === 'style' || attr.name === 'class') {
        el.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    getBlogBySlug(slug)
      .then((data) => {
        setBlog(data);
        if (!data) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background.default }}>
        <LoadingSpinner message="Loading post..." />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: colors.background.default }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.heading }}>Post not found</h1>
        <p className="text-gray-600 mb-6">The blog post you’re looking for doesn’t exist or was removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
          style={{ backgroundColor: colors.primary.main }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  const hasCta = blog.pdfUrl || blog.link;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background.default }}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: colors.text.link }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mb-10">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
            style={{ color: colors.text.heading }}
          >
            {blog.heading}
          </h1>
        </header>

        {blog.featuredImageUrl && (
          <figure className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <img
              src={blog.featuredImageUrl}
              alt={blog.imageTitle || blog.heading}
              className="w-full h-auto object-cover"
            />
            {blog.imageTitle && (
              <figcaption
                className="mt-2 text-sm px-1"
                style={{ color: colors.text.secondary }}
              >
                {blog.imageTitle}
              </figcaption>
            )}
          </figure>
        )}

        {blog.description && (
          <div
            className="prose prose-lg max-w-none mb-10"
            style={{
              color: colors.text.primary,
              lineHeight: 1.7,
            }}
          >
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(blog.description),
              }}
            />
          </div>
        )}

        {hasCta && (
          <div className="pt-6 border-t flex flex-wrap gap-4" style={{ borderColor: colors.border.light }}>
            {blog.pdfUrl && (
              <a
                href={blog.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.primary.main }}
              >
                <FileText className="h-5 w-5" />
                View PDF
              </a>
            )}
            {blog.link && (
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold border-2 transition-colors"
                style={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                }}
              >
                <ExternalLink className="h-5 w-5" />
                Read more
              </a>
            )}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
