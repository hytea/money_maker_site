import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { Article, CalculatorCategory } from '@/types/article';
import { articleService } from '@/lib/articleService';
import SEO from '@/components/SEO';

export function ArticleList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as CalculatorCategory | null;

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | 'all'>(
    categoryParam || 'all'
  );

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const publishedArticles = await articleService.getPublishedArticles();
      setArticles(publishedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  const categories: Array<{ value: CalculatorCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Articles' },
    { value: 'tip-calculator', label: 'Tip Calculator' },
    { value: 'loan-calculator', label: 'Loan Calculator' },
    { value: 'pregnancy-calculator', label: 'Pregnancy' },
    { value: 'bmi-calculator', label: 'BMI & Health' },
    { value: 'discount-calculator', label: 'Discounts' },
    { value: 'age-calculator', label: 'Age Calculator' },
    { value: 'split-bill-calculator', label: 'Split Bill' },
    { value: 'unit-converter', label: 'Unit Converter' },
    { value: 'general', label: 'General' },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Calculator Articles & Guides - QuickCalc Tools"
        description="Learn how to use our calculators effectively with in-depth guides, tips, and best practices for all your calculation needs."
        keywords="calculator guides, how to calculate, calculation tips, calculator tutorials"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-50 border border-purple-200 mb-6">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">
              ARTICLES & GUIDES
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculator Guides & Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to make the most of our calculators with expert guides,
            tips, and best practices
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search or filter'
                  : 'No articles available yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleArticleClick(article.slug)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="mb-2">
                      {article.category.replace(/-/g, ' ')}
                    </Badge>
                    {article.featured && (
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-primary-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.publishedAt
                        ? formatDate(article.publishedAt)
                        : formatDate(article.createdAt)}
                    </div>
                    <span>{article.views} views</span>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredArticles.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        )}
      </div>
    </>
  );
}
