import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Article, CalculatorCategory } from '@/types/article';
import { articleService } from '@/lib/articleService';
import { aiArticlePromptTemplate, seoChecklist, articleTemplates } from '@/config/seoGuidelines';

export function ArticleEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    focusKeyword: '',
    category: 'general',
    relatedTools: [],
    tags: [],
    status: 'draft',
    author: user?.displayName || user?.email || 'Admin',
    views: 0,
    featured: false,
    aiGenerated: false,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [relatedToolInput, setRelatedToolInput] = useState('');
  const [showSEOChecklist, setShowSEOChecklist] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const article = await articleService.getArticle(articleId);
      if (article) {
        setFormData(article);
      } else {
        alert('Article not found');
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof Article,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const slug = articleService.generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }

    // Auto-generate excerpt from content (first 160 chars)
    if (field === 'content' && typeof value === 'string' && !formData.excerpt) {
      const excerpt = value.replace(/[#*_\[\]]/g, '').substring(0, 160);
      setFormData((prev) => ({
        ...prev,
        excerpt: excerpt.trim() + '...',
      }));
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && formData.keywords) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: (prev.keywords || []).filter((k) => k !== keyword),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleAddRelatedTool = () => {
    if (relatedToolInput.trim() && formData.relatedTools) {
      setFormData((prev) => ({
        ...prev,
        relatedTools: [...(prev.relatedTools || []), relatedToolInput.trim()],
      }));
      setRelatedToolInput('');
    }
  };

  const handleRemoveRelatedTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedTools: (prev.relatedTools || []).filter((t) => t !== tool),
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title?.trim()) errors.push('Title is required');
    if (!formData.slug?.trim()) errors.push('Slug is required');
    if (!formData.content?.trim()) errors.push('Content is required');
    if (!formData.excerpt?.trim()) errors.push('Excerpt is required');
    if (!formData.focusKeyword?.trim()) errors.push('Focus keyword is required');
    if (!formData.category) errors.push('Category is required');

    // SEO validations
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      errors.push('Meta title should be 60 characters or less');
    }
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      errors.push('Meta description should be 160 characters or less');
    }

    return errors;
  };

  const handleSave = async (publish: boolean = false) => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    try {
      setSaving(true);

      const articleData = {
        ...formData,
        status: publish ? ('published' as const) : formData.status,
        keywords: formData.keywords || [],
        tags: formData.tags || [],
        relatedTools: formData.relatedTools || [],
      } as Omit<Article, 'id'>;

      if (id) {
        await articleService.updateArticle(id, articleData);
        alert('Article updated successfully!');
      } else {
        const newId = await articleService.createArticle(articleData);
        alert('Article created successfully!');
        navigate(`/admin/articles/edit/${newId}`);
      }

      if (publish) {
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const generateAIPrompt = () => {
    let prompt = aiArticlePromptTemplate;

    // Replace placeholders
    prompt = prompt.replace('{focusKeyword}', formData.focusKeyword || '');
    prompt = prompt.replace('{articleTopic}', formData.title || '');
    prompt = prompt.replace('{relatedCalculator}', formData.category || '');
    prompt = prompt.replace('{targetAudience}', 'Calculator users seeking information');
    prompt = prompt.replace(
      '{trendingKeywords}',
      (formData.keywords || []).join(', ')
    );
    prompt = prompt.replace('{searchIntent}', 'informational');

    // Add trending topic if available
    if (formData.trendingTopics && formData.trendingTopics.length > 0) {
      prompt = prompt.replace(
        '{trendingTopic}',
        formData.trendingTopics[0].keyword
      );
      prompt = prompt.replace(
        '{relatedSearches}',
        formData.trendingTopics[0].relatedQueries.join(', ')
      );
    } else {
      prompt = prompt.replace('{trendingTopic}', 'N/A');
      prompt = prompt.replace('{relatedSearches}', 'N/A');
    }

    // Add section titles
    prompt = prompt.replace('{section1Title}', 'Understanding the Basics');
    prompt = prompt.replace('{section2Title}', 'How to Calculate');
    prompt = prompt.replace('{section3Title}', 'Tips and Best Practices');

    return prompt;
  };

  const categories: CalculatorCategory[] = [
    'tip-calculator',
    'loan-calculator',
    'pregnancy-calculator',
    'bmi-calculator',
    'discount-calculator',
    'age-calculator',
    'split-bill-calculator',
    'unit-converter',
    'general',
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Loading article...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/articles')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-50 border border-purple-200 mb-4">
          <BookOpen className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-semibold text-purple-800">
            {id ? 'EDIT ARTICLE' : 'NEW ARTICLE'}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {id ? 'Edit Article' : 'Create New Article'}
        </h1>
        <p className="text-lg text-gray-600">
          Create SEO-optimized content to drive organic traffic
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the core details of your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., How to Calculate Tips: Complete Guide for 2025"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="how-to-calculate-tips-guide"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /articles/{formData.slug || 'slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt || ''}
                  onChange={(e) =>
                    handleInputChange('excerpt', e.target.value)
                  }
                  placeholder="Brief summary of the article (140-160 characters)"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt?.length || 0}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category || 'general'}
                  onChange={(e) =>
                    handleInputChange(
                      'category',
                      e.target.value as CalculatorCategory
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/-/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>
                Write your article in Markdown format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="# Article Title&#10;&#10;## Introduction&#10;&#10;Your content here...&#10;&#10;## Section 2&#10;&#10;More content..."
                className="w-full min-h-[400px] px-3 py-2 border rounded-md font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Word count: {formData.content?.split(/\s+/).length || 0} words
                (Recommended: 1,200-1,800)
              </p>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your article for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="focusKeyword">Focus Keyword *</Label>
                <Input
                  id="focusKeyword"
                  value={formData.focusKeyword || ''}
                  onChange={(e) =>
                    handleInputChange('focusKeyword', e.target.value)
                  }
                  placeholder="tip calculator"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Main keyword to target for SEO
                </p>
              </div>

              <div>
                <Label>Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.keywords || []).map((keyword) => (
                    <Badge
                      key={keyword}
                      className="cursor-pointer"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ''}
                  onChange={(e) =>
                    handleInputChange('metaTitle', e.target.value)
                  }
                  placeholder="Leave empty to use article title"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle?.length || 0}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription || ''}
                  onChange={(e) =>
                    handleInputChange('metaDescription', e.target.value)
                  }
                  placeholder="Leave empty to use excerpt"
                  className="w-full min-h-[60px] px-3 py-2 border rounded-md"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription?.length || 0}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Content */}
          <Card>
            <CardHeader>
              <CardTitle>Related Content</CardTitle>
              <CardDescription>
                Link to related calculators and add tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Related Tools</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={relatedToolInput}
                    onChange={(e) => setRelatedToolInput(e.target.value)}
                    placeholder="/tip-calculator"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRelatedTool();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddRelatedTool}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.relatedTools || []).map((tool) => (
                    <Badge
                      key={tool}
                      className="cursor-pointer"
                      onClick={() => handleRemoveRelatedTool(tool)}
                    >
                      {tool} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) =>
                    handleInputChange(
                      'status',
                      e.target.value as Article['status']
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    handleInputChange('featured', e.target.checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Article
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aiGenerated"
                  checked={formData.aiGenerated || false}
                  onChange={(e) =>
                    handleInputChange('aiGenerated', e.target.checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="aiGenerated" className="cursor-pointer">
                  AI Generated
                </Label>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="w-full"
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {id ? 'Update & Publish' : 'Publish'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Get AI-powered article generation prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAIPrompt(!showAIPrompt)}
              >
                {showAIPrompt ? 'Hide' : 'Show'} AI Prompt
              </Button>

              {showAIPrompt && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-xs text-gray-600 mb-2">
                    Copy this prompt and use it with ChatGPT, Claude, or your
                    preferred AI:
                  </p>
                  <pre className="text-xs bg-white p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                    {generateAIPrompt()}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(generateAIPrompt());
                      alert('Prompt copied to clipboard!');
                    }}
                  >
                    Copy Prompt
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-semibold">Quick Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fill in basic info first</li>
                  <li>Add focus keyword & category</li>
                  <li>Generate & copy AI prompt</li>
                  <li>Paste AI output into content</li>
                  <li>Review & optimize</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* SEO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Checklist</CardTitle>
              <CardDescription>
                Ensure your article follows SEO best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowSEOChecklist(!showSEOChecklist)}
              >
                {showSEOChecklist ? 'Hide' : 'Show'} Checklist
              </Button>

              {showSEOChecklist && (
                <div className="space-y-2">
                  {seoChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
