# AI Integration Guide

This document describes the AI integration plugin system implemented in QuickCalc Tools.

## Overview

The AI integration provides a flexible, plugin-based architecture for adding AI-powered features to the application. It currently supports OpenRouter but is designed to easily accommodate additional AI providers.

## Architecture

### Plugin System

The AI integration follows a plugin architecture pattern:

```
src/lib/ai/
├── types.ts              # Core interfaces and types
├── aiService.ts          # Main AI service (singleton)
├── index.ts              # Public exports
└── providers/
    └── openrouter.ts     # OpenRouter provider implementation
```

### Key Components

1. **AIProvider Interface** (`types.ts`)
   - Defines the contract all AI providers must implement
   - Ensures consistent behavior across different providers

2. **AIService** (`aiService.ts`)
   - Singleton service that manages AI providers
   - Handles provider registration and selection
   - Provides unified interface for AI features

3. **OpenRouterProvider** (`providers/openrouter.ts`)
   - First implementation of the AIProvider interface
   - Connects to OpenRouter API
   - Uses DeepSeek 3.1 free model by default

4. **useAI Hook** (`hooks/useAI.ts`)
   - React hook for easy AI integration in components
   - Manages loading and error states
   - Provides simple `ask()` interface

5. **AIInsights Component** (`components/AIInsights.tsx`)
   - Reusable component for AI-powered insights
   - Works with any calculator/tool
   - Handles UI state and user interaction

## Setup

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your OpenRouter API key:

```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

Get your API key from: https://openrouter.ai/keys

### 2. Using the DeepSeek 3.1 Free Model

The default configuration uses `deepseek/deepseek-chat-v3.1:free`, which provides:
- Free tier access (no cost)
- Good performance for general tasks
- Reasonable token limits

## Usage

### Basic Usage with Hook

```tsx
import { useAI } from '@/hooks/useAI';

function MyComponent() {
  const { ask, response, loading, error, isAvailable } = useAI();

  const handleClick = async () => {
    try {
      const result = await ask(
        "What's a healthy BMI range?",
        "You are a health assistant."
      );
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAvailable) {
    return <div>AI features not available</div>;
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        Ask AI
      </button>
      {response && <p>{response}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Using AIInsights Component

```tsx
import { AIInsights } from '@/components/AIInsights';

function MyCalculator() {
  return (
    <AIInsights
      context={{
        bmi: 23.5,
        age: 30,
        weight: '150 lbs',
      }}
      toolType="BMI Calculator"
    />
  );
}
```

### Direct Service Usage

```tsx
import { aiService } from '@/lib/ai';

// Simple question
const answer = await aiService.ask("What is a healthy BMI?");

// With system prompt and options
const answer = await aiService.ask(
  "Provide health advice",
  "You are a certified nutritionist",
  { temperature: 0.7, maxTokens: 500 }
);

// Chat with message history
const response = await aiService.chat([
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'What is BMI?' },
  { role: 'assistant', content: 'BMI is Body Mass Index...' },
  { role: 'user', content: 'How is it calculated?' },
]);
```

## Adding New AI Providers

To add a new AI provider (e.g., OpenAI, Anthropic):

1. **Create Provider Class**

```typescript
// src/lib/ai/providers/myprovider.ts
import type { AIProvider, AIProviderConfig, AIMessage, AIResponse } from '../types';

export class MyProvider implements AIProvider {
  readonly name = 'myprovider';

  constructor(config: AIProviderConfig) {
    // Initialize provider
  }

  isConfigured(): boolean {
    // Check if provider is ready
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    // Implement chat logic
  }

  getAvailableModels(): string[] {
    return ['model-1', 'model-2'];
  }
}
```

2. **Register Provider**

```typescript
// In your app initialization or aiService.ts
import { MyProvider } from './providers/myprovider';

const myProvider = new MyProvider({
  apiKey: import.meta.env.VITE_MYPROVIDER_API_KEY,
});

aiService.registerProvider(myProvider);
aiService.setActiveProvider('myprovider');
```

## Features Implemented

### BMI Calculator AI Insights

The BMI calculator now includes AI-powered personalized health recommendations:

- Location: `/bmi-calculator`
- Features:
  - Analyzes user's BMI, age, activity level, and goals
  - Provides personalized health advice
  - Generates actionable recommendations
  - Client-side only (no backend required)

## Future Enhancements

Potential additions to the AI integration:

1. **Multiple Provider Support**
   - Add OpenAI, Anthropic, Google AI providers
   - Allow users to switch between providers
   - Provider comparison features

2. **Advanced Features**
   - Streaming responses for better UX
   - Conversation history/context
   - Multi-turn conversations
   - Voice input/output

3. **More AI-Powered Tools**
   - Meal planning based on calorie goals
   - Workout recommendations
   - Financial advice for loans
   - Smart budgeting tips

4. **Caching & Optimization**
   - Cache common queries
   - Rate limiting
   - Token usage tracking
   - Cost optimization

## Security Considerations

- API keys are stored in environment variables (never committed)
- All requests are made client-side
- User data is not stored or logged
- CORS headers are properly configured
- Error messages don't expose sensitive information

## Troubleshooting

### AI features not showing up
- Check that `VITE_OPENROUTER_API_KEY` is set in `.env.local`
- Verify the key is valid at https://openrouter.ai
- Ensure you've restarted the dev server after adding the key

### API errors
- Check your OpenRouter account for rate limits
- Verify the API key has proper permissions
- Check network connectivity
- Review browser console for detailed error messages

### Component not rendering
- Confirm `isAvailable` returns `true`
- Check that the component is imported correctly
- Verify React version compatibility

## API Reference

See TypeScript definitions in `src/lib/ai/types.ts` for complete API documentation.

## License

Same as main project license.
