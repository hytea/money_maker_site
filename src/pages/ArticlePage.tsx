import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { Article } from '@/types/article';
import { articleService } from '@/lib/articleService';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const fetchedArticle = await articleService.getArticleBySlug(articleSlug);

      if (fetchedArticle) {
        setArticle(fetchedArticle);

        // Increment view count
        await articleService.incrementViews(fetchedArticle.id);

        // Load related articles
        const related = await articleService.getRelatedArticles(
          fetchedArticle.id,
          fetchedArticle.category,
          fetchedArticle.tags,
          3
        );
        setRelatedArticles(related);
      } else {
        // Article not found
        navigate('/articles');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Loading article...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <>
      <SEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        keywords={(article.keywords || []).join(', ')}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/articles" className="hover:text-primary-600">
            Articles
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{article.title}</span>
        </div>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="text-sm">
                {article.category.replace(/-/g, ' ')}
              </Badge>
              {article.featured && (
                <Badge className="bg-yellow-100 text-yellow-700">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.publishedAt
                  ? formatDate(article.publishedAt)
                  : formatDate(article.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views} views
              </div>
              <div className="flex items-center gap-1">
                <span>By {article.author}</span>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="mb-8"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary-600 hover:text-primary-700 underline"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={
                      href?.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Related Tools CTA */}
          {article.relatedTools.length > 0 && (
            <Card className="mb-12 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <CardHeader>
                <CardTitle>Try Our Calculators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Put what you've learned into practice with our free
                  calculators:
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.relatedTools.map((tool) => (
                    <Button
                      key={tool}
                      variant="outline"
                      onClick={() => navigate(tool)}
                    >
                      {tool.replace(/^\//, '').replace(/-/g, ' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    navigate(`/articles/${relatedArticle.slug}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <CardHeader>
                    <Badge className="mb-2 w-fit">
                      {relatedArticle.category.replace(/-/g, ' ')}
                    </Badge>
                    <CardTitle className="text-lg leading-tight">
                      {relatedArticle.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back to Articles */}
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => navigate('/articles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Articles
          </Button>
        </div>
      </div>
    </>
  );
}
