/**
 * Cloud Functions for AI Health Coach
 *
 * This function proxies AI requests to OpenRouter API, keeping the API key secure on the server side.
 * It includes rate limiting, input validation, and usage monitoring.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_USER = 10; // per window
const MAX_REQUESTS_PER_IP = 20; // per window (catches abuse across multiple users)
const MAX_INPUT_LENGTH = 500;
const MAX_TOKENS = 800;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory rate limit store (for production, use Firebase Realtime Database or Firestore)
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

/**
 * Check if request exceeds rate limits
 */
function checkRateLimit(identifier: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    // Start new window
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Clean up old rate limit entries
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up rate limits every 5 minutes
setInterval(cleanupRateLimits, 300000);

/**
 * AI Chat Proxy Function
 *
 * Security Features:
 * - API key stored server-side only
 * - Per-user and per-IP rate limiting
 * - Input validation and sanitization
 * - Usage logging and monitoring
 * - CORS protection
 */
export const aiChat = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
  })
  .https.onRequest(async (req, res) => {
    // CORS headers (restrict to your domain in production)
    res.set('Access-Control-Allow-Origin', '*'); // TODO: Change to your domain
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      // Extract request data
      const { prompt, systemPrompt, userId } = req.body;

      // Input validation
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Invalid prompt' });
        return;
      }

      if (prompt.length > MAX_INPUT_LENGTH) {
        res.status(400).json({
          error: `Prompt too long. Maximum ${MAX_INPUT_LENGTH} characters.`
        });
        return;
      }

      // Get client identifier for rate limiting
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const userIdentifier = userId || `ip-${clientIp}`;

      // Check rate limits
      if (!checkRateLimit(`user-${userIdentifier}`, MAX_REQUESTS_PER_USER)) {
        res.status(429).json({
          error: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_USER} requests per minute.`
        });

        // Log abuse attempt
        console.warn(`Rate limit exceeded for user: ${userIdentifier}`);
        return;
      }

      if (!checkRateLimit(`ip-${clientIp}`, MAX_REQUESTS_PER_IP)) {
        res.status(429).json({
          error: 'Rate limit exceeded for your IP address.'
        });

        console.warn(`IP rate limit exceeded: ${clientIp}`);
        return;
      }

      // Get API key from environment (never expose to client)
      const apiKey = functions.config().openrouter?.apikey;

      if (!apiKey) {
        console.error('OpenRouter API key not configured');
        res.status(500).json({ error: 'Service configuration error' });
        return;
      }

      // Build messages array
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      // Call OpenRouter API
      const startTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://quickcalc.tools', // TODO: Update with your domain
          'X-Title': 'QuickCalc Tools - AI Health Coach'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: messages,
          temperature: 0.8,
          max_tokens: MAX_TOKENS
        })
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);
        res.status(response.status).json({
          error: 'AI service error',
          details: response.status === 429 ? 'API rate limit exceeded' : undefined
        });
        return;
      }

      const data = await response.json();

      // Extract response content
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('Invalid API response structure:', data);
        res.status(500).json({ error: 'Invalid response from AI service' });
        return;
      }

      // Log usage for monitoring
      console.log('AI request processed:', {
        user: userIdentifier,
        ip: clientIp,
        promptLength: prompt.length,
        responseLength: content.length,
        responseTime,
        usage: data.usage
      });

      // Return successful response
      res.status(200).json({
        content,
        usage: data.usage,
        model: data.model
      });

    } catch (error) {
      console.error('Error processing AI request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * Health check endpoint
 */
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Health Coach API'
  });
});
