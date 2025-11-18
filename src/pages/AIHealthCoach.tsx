import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdPlaceholder } from '@/components/AdSense';
import { useAI } from '@/hooks/useAI';
import {
  MessageCircle,
  Send,
  Trash2,
  Download,
  Sparkles,
  Loader2,
  Heart,
  Apple,
  Dumbbell,
  Moon,
  AlertCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'ai-health-coach-messages';

const SYSTEM_PROMPT = `You are a knowledgeable and supportive health coach. You provide evidence-based advice on nutrition, fitness, wellness, and healthy lifestyle habits.

Guidelines:
- Be encouraging, supportive, and motivational
- Provide practical, actionable advice
- Always remind users to consult healthcare professionals for medical issues
- Focus on sustainable, healthy habits rather than quick fixes
- Ask clarifying questions when needed to provide personalized advice
- Be conversational and friendly while maintaining professionalism
- Use specific numbers and recommendations when appropriate
- Celebrate user's progress and efforts

Remember: You are a coach and advisor, not a medical doctor. Always encourage users to seek professional medical advice for health concerns.`;

const QUICK_SUGGESTIONS = [
  {
    icon: Apple,
    text: "How can I eat healthier?",
    prompt: "I want to improve my diet and eat healthier. What are some practical tips to get started?"
  },
  {
    icon: Dumbbell,
    text: "Create a workout plan",
    prompt: "Can you help me create a beginner-friendly workout plan? I want to get more active."
  },
  {
    icon: Heart,
    text: "Tips for better heart health",
    prompt: "What are the best ways to improve my cardiovascular health and reduce heart disease risk?"
  },
  {
    icon: Moon,
    text: "Improve my sleep quality",
    prompt: "I'm having trouble sleeping well. What are some evidence-based tips to improve my sleep quality?"
  }
];

export function AIHealthCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ask, isAvailable, error: aiError } = useAI({
    temperature: 0.8,
    maxTokens: 800,
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    document.title = 'AI Health Coach - Free Personalized Health & Fitness Advice | QuickCalc Tools';

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse stored messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const prompt = customPrompt || inputValue.trim();
    if (!prompt || !isAvailable) return;

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ask(prompt, SYSTEM_PROMPT);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (prompt: string) => {
    handleSend(prompt);
  };

  const handleClearChat = () => {
    if (messages.length > 0 && confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => {
      const time = msg.timestamp.toLocaleTimeString();
      const role = msg.role === 'user' ? 'You' : 'Health Coach';
      return `[${time}] ${role}: ${msg.content}`;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-coach-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AI Health Coach
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal AI-powered health and wellness advisor. Get personalized advice on nutrition,
            fitness, and healthy lifestyle habits - completely free!
          </p>
          {isAvailable && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI Coach is online and ready to help
            </div>
          )}
        </div>

        {/* Ad Placement */}
        <AdPlaceholder />

        {/* Main Chat Card */}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                  Chat with Your Health Coach
                </CardTitle>
                <CardDescription className="mt-2">
                  Ask anything about health, nutrition, fitness, or wellness
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {messages.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportChat}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearChat}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {!isAvailable ? (
              <div className="text-center py-12 px-4">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Health Coach Not Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  The AI health coach requires an OpenRouter API key to function.
                  Please configure your API key in the environment settings.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <p className="text-sm text-gray-700 font-mono">
                    VITE_OPENROUTER_API_KEY=your-key-here
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Quick Suggestions (shown when chat is empty) */}
                {messages.length === 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Popular Questions:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {QUICK_SUGGESTIONS.map((suggestion, index) => {
                        const Icon = suggestion.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleQuickSuggestion(suggestion.prompt)}
                            className="justify-start h-auto py-4 px-4 text-left hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                          >
                            <Icon className="w-5 h-5 mr-3 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm">{suggestion.text}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Messages Container */}
                <div className="min-h-[400px] max-h-[500px] overflow-y-auto mb-4 space-y-4 pr-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === 'assistant' && (
                            <Sparkles className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {aiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {aiError}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your health coach anything..."
                    disabled={isLoading}
                    className="flex-1 border-2 border-gray-200 focus:border-emerald-400"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>Disclaimer:</strong> This AI health coach provides general wellness information
                    and is not a substitute for professional medical advice, diagnosis, or treatment.
                    Always consult with qualified healthcare professionals for medical concerns.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 rounded-full mb-3">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personalized Advice</h3>
                <p className="text-sm text-gray-600">
                  Get tailored recommendations based on your unique health goals and situation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 rounded-full mb-3">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-sm text-gray-600">
                  Chat anytime, anywhere. Your AI health coach is always ready to help
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 rounded-full mb-3">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based</h3>
                <p className="text-sm text-gray-600">
                  Recommendations grounded in scientific research and health best practices
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8">
          <AdPlaceholder />
        </div>

        {/* SEO Content */}
        <div className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Free AI-Powered Health Coach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What Can the AI Health Coach Help With?</h3>
              <ul className="space-y-1 ml-4">
                <li>• Personalized nutrition and diet advice</li>
                <li>• Custom workout and fitness plans</li>
                <li>• Weight management strategies</li>
                <li>• Sleep optimization tips</li>
                <li>• Stress management techniques</li>
                <li>• Healthy lifestyle habits</li>
                <li>• General wellness guidance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Use Our AI Health Coach?</h3>
              <ul className="space-y-1 ml-4">
                <li>• Completely free to use</li>
                <li>• No signup or registration required</li>
                <li>• Private and confidential conversations</li>
                <li>• Evidence-based recommendations</li>
                <li>• Available 24/7 whenever you need help</li>
                <li>• Export and save your chat history</li>
                <li>• Get started with quick suggestion topics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
