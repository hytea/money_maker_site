import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  TrendingUp,
  Search,
  Plus,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  CalculatorCategory,
  TrendingTopic,
  ArticleSuggestion,
} from '@/types/article';
import {
  trendingTopicsService,
  formatTrendingTopic,
  groupSuggestionsByUrgency,
} from '@/lib/trendingTopics';
import { calculatorKeywords } from '@/config/seoGuidelines';

export function TrendingTopicsDiscovery() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CalculatorCategory>('general');
  const [customKeywords, setCustomKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>([]);
  const [manualTopics, setManualTopics] = useState<TrendingTopic[]>([]);

  // Manual topic entry form
  const [manualKeyword, setManualKeyword] = useState('');
  const [manualVolume, setManualVolume] = useState('');
  const [manualTrend, setManualTrend] = useState<'rising' | 'steady' | 'declining'>('rising');

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

  const handleFetchTrends = async () => {
    try {
      setLoading(true);

      const keywords = customKeywords
        ? customKeywords.split(',').map((k) => k.trim())
        : [];

      const response = await trendingTopicsService.fetchTrendingTopics({
        category,
        keywords,
        location: 'US',
        timeframe: 'now 7-d',
      });

      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error fetching trends:', error);
      alert('Failed to fetch trending topics');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualTopic = () => {
    if (!manualKeyword.trim() || !manualVolume) {
      alert('Please enter keyword and search volume');
      return;
    }

    const topic = trendingTopicsService.createManualTrendingTopic(
      manualKeyword,
      parseInt(manualVolume),
      manualTrend,
      []
    );

    setManualTopics([...manualTopics, topic]);
    setManualKeyword('');
    setManualVolume('');
    setManualTrend('rising');
  };

  const handleCreateArticleFromSuggestion = (suggestion: ArticleSuggestion) => {
    // Navigate to article editor with pre-filled data
    const searchParams = new URLSearchParams({
      title: suggestion.title,
      category: category,
      keywords: suggestion.suggestedKeywords.join(','),
      focusKeyword: suggestion.suggestedKeywords[0] || '',
    });

    navigate(`/admin/articles/create?${searchParams.toString()}`);
  };

  const groupedSuggestions = groupSuggestionsByUrgency(suggestions);

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

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-blue-50 border border-green-200 mb-4">
          <TrendingUp className="h-3.5 w-3.5 text-green-600" />
          <span className="text-xs font-semibold text-green-800">
            TRENDING TOPICS
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Trending Topics Discovery
        </h1>
        <p className="text-lg text-gray-600">
          Find high-value trending topics to create SEO-optimized articles
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Discovery Tools */}
        <div className="lg:col-span-1 space-y-6">
          {/* Automated Discovery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Auto Discovery
              </CardTitle>
              <CardDescription>
                Generate article suggestions based on category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as CalculatorCategory)
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

              <div>
                <Label htmlFor="keywords">
                  Additional Keywords (optional)
                </Label>
                <Input
                  id="keywords"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords
                </p>
              </div>

              <Button
                onClick={handleFetchTrends}
                disabled={loading}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Generate Suggestions'}
              </Button>

              {calculatorKeywords[category] && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Base Keywords for {category}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {calculatorKeywords[category].slice(0, 5).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Topic Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Topic Entry</CardTitle>
              <CardDescription>
                Add trending topics from Google Trends manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manualKeyword">Keyword</Label>
                <Input
                  id="manualKeyword"
                  value={manualKeyword}
                  onChange={(e) => setManualKeyword(e.target.value)}
                  placeholder="tip calculator 2025"
                />
              </div>

              <div>
                <Label htmlFor="manualVolume">Search Volume (0-100)</Label>
                <Input
                  id="manualVolume"
                  type="number"
                  min="0"
                  max="100"
                  value={manualVolume}
                  onChange={(e) => setManualVolume(e.target.value)}
                  placeholder="75"
                />
              </div>

              <div>
                <Label htmlFor="manualTrend">Trend</Label>
                <select
                  id="manualTrend"
                  value={manualTrend}
                  onChange={(e) =>
                    setManualTrend(
                      e.target.value as 'rising' | 'steady' | 'declining'
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="rising">📈 Rising</option>
                  <option value="steady">➡️ Steady</option>
                  <option value="declining">📉 Declining</option>
                </select>
              </div>

              <Button
                onClick={handleAddManualTopic}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>

              {manualTopics.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Manual Topics:
                  </p>
                  <div className="space-y-1">
                    {manualTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-50 p-2 rounded"
                      >
                        {formatTrendingTopic(topic)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Research Resources</CardTitle>
              <CardDescription>
                Use these tools to find trending topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() =>
                  window.open('https://trends.google.com/trends/', '_blank')
                }
              >
                Google Trends
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() =>
                  window.open(
                    'https://answerthepublic.com/',
                    '_blank'
                  )
                }
              >
                AnswerThePublic
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() =>
                  window.open(
                    'https://ahrefs.com/keyword-generator',
                    '_blank'
                  )
                }
              >
                Ahrefs Keyword Generator
                <ExternalLink className="h-4 w-4" />
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Pro Tip:</p>
                    <p>
                      For best results, research topics on Google Trends,
                      then manually enter the data here. Look for "rising"
                      topics in your calculator category.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {/* High Priority */}
          {groupedSuggestions.high.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-700">
                    HIGH PRIORITY
                  </Badge>
                  Article Suggestions
                </CardTitle>
                <CardDescription>
                  These topics are time-sensitive and should be created ASAP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedSuggestions.high.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <Badge className="bg-red-100 text-red-700 ml-2">
                        {suggestion.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {suggestion.reason}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {suggestion.suggestedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Est. Search Volume: {suggestion.estimatedSearchVolume}
                      </span>
                      <span>
                        Relevance: {suggestion.relevanceScore}/100
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() =>
                        handleCreateArticleFromSuggestion(suggestion)
                      }
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Create Article
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Medium Priority */}
          {groupedSuggestions.medium.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-700">
                    MEDIUM PRIORITY
                  </Badge>
                  Article Suggestions
                </CardTitle>
                <CardDescription>
                  Good opportunities for evergreen content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedSuggestions.medium.slice(0, 5).map((suggestion, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <Badge className="bg-yellow-100 text-yellow-700 ml-2">
                        {suggestion.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {suggestion.reason}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {suggestion.suggestedKeywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() =>
                        handleCreateArticleFromSuggestion(suggestion)
                      }
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Create Article
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Low Priority */}
          {groupedSuggestions.low.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-700">
                    LOW PRIORITY
                  </Badge>
                  Article Suggestions
                </CardTitle>
                <CardDescription>
                  Consider these for content calendar planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedSuggestions.low.slice(0, 3).map((suggestion, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {suggestion.title}
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() =>
                        handleCreateArticleFromSuggestion(suggestion)
                      }
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Create Article
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {suggestions.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Suggestions Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a category and click "Generate Suggestions" to discover
                  trending article opportunities
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
