# Security Documentation - AI Health Coach

## Overview

This document outlines the security measures implemented for the AI Health Coach feature and provides deployment instructions for secure production use.

## Security Features Implemented

### 1. Medical Disclaimer & Legal Protection

**Feature**: Mandatory medical disclaimer modal
**Location**: `src/pages/AIHealthCoach.tsx`

**Implementation**:
- Users must accept comprehensive medical disclaimer before using the feature
- Disclaimer clearly states:
  - Not a substitute for professional medical advice
  - Limitations of AI-generated health information
  - Emergency warning
  - Liability waiver
- Acceptance is stored in localStorage
- Modal cannot be bypassed

**Legal Protection**: Helps protect against medical liability claims

---

### 2. API Key Security (Firebase Functions Proxy)

**Problem**: Client-side API keys are exposed in browser code and can be extracted and abused.

**Solution**: Firebase Functions proxy that keeps API keys server-side.

#### Architecture

```
Client Browser          Firebase Cloud          OpenRouter API
     |                       |                        |
     |  1. POST /aiChat      |                        |
     |--------------------->|                        |
     |                       | 2. Validate & rate limit|
     |                       |                        |
     |                       | 3. API call with secret key
     |                       |----------------------->|
     |                       |                        |
     |                       | 4. Response             |
     |                       |<-----------------------|
     | 5. Sanitized response |                        |
     |<---------------------|                        |
```

#### Files
- **Cloud Function**: `functions/src/index.ts`
- **Client Provider**: `src/lib/ai/providers/firebase.ts`
- **Service Config**: `src/lib/ai/aiService.ts`

#### Benefits
- ✅ API key never exposed to clients
- ✅ Cannot be extracted from browser DevTools
- ✅ Server-side rate limiting
- ✅ Usage monitoring and logging
- ✅ IP-based abuse prevention

---

### 3. Rate Limiting

**Implementation**: Multi-layer rate limiting

#### Client-Side Rate Limiting
**Location**: `src/pages/AIHealthCoach.tsx`
- **Limit**: 10 requests per minute per user
- **Storage**: In-memory timestamps
- **Purpose**: Prevents accidental spam, provides instant feedback

#### Server-Side Rate Limiting
**Location**: `functions/src/index.ts`
- **User Limit**: 10 requests per minute per user ID
- **IP Limit**: 20 requests per minute per IP address
- **Storage**: In-memory Map (production should use Firestore/Redis)
- **Purpose**: Prevents API abuse even if client-side checks are bypassed

**Why Both?**
- Client-side: Better UX, instant feedback
- Server-side: Security enforcement, cannot be bypassed

---

### 4. Input Validation

**Location**: Both client and server

#### Client-Side (`src/pages/AIHealthCoach.tsx`)
```typescript
MAX_INPUT_LENGTH = 500 characters
- Empty string rejection
- Length validation with character counter
- Disabled state during loading
```

#### Server-Side (`functions/src/index.ts`)
```typescript
- Type checking (must be string)
- Length limit enforcement (500 chars)
- Sanitization (via JSON.stringify)
- XSS prevention
```

**Defense in Depth**: Validation at both layers prevents bypassing client checks

---

### 5. localStorage Quota Handling

**Location**: `src/pages/AIHealthCoach.tsx`

**Features**:
- Try-catch wrapper around localStorage operations
- Detects `QuotaExceededError` specifically
- User-friendly error messages
- Suggests exporting and clearing chat
- Graceful degradation if storage fails

**Why Important**: Prevents app crashes when localStorage is full or disabled

---

### 6. Error Handling & Logging

#### Client-Side
- User-friendly error messages (no technical details exposed)
- Fallback responses for AI failures
- Visual error indicators

#### Server-Side (`functions/src/index.ts`)
```typescript
// Structured logging for monitoring
console.log('AI request processed:', {
  user: userIdentifier,
  ip: clientIp,
  promptLength: prompt.length,
  responseLength: content.length,
  responseTime,
  usage: data.usage
});

// Abuse detection logging
console.warn('Rate limit exceeded:', { user, ip });
```

**Benefits**:
- Detect usage patterns
- Identify abuse attempts
- Monitor API costs
- Debug issues

---

## Deployment Guide

### Prerequisites

1. **Firebase Account**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

2. **OpenRouter API Key**
   - Sign up at https://openrouter.ai
   - Generate API key
   - **DO NOT** commit this to git

### Step 1: Create Firebase Project

```bash
firebase projects:create your-project-id
```

Update `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Step 2: Deploy Cloud Functions

```bash
cd functions
npm install
cd ..

# Set OpenRouter API key in Firebase config (server-side only!)
firebase functions:config:set openrouter.apikey="sk-or-v1-your-actual-key"

# Deploy functions
firebase deploy --only functions
```

### Step 3: Configure Client

Create `.env.local`:
```bash
# Production setup - use Firebase Functions
VITE_FIREBASE_FUNCTION_URL=https://us-central1-your-project-id.cloudfunctions.net/aiChat

# DO NOT set VITE_OPENROUTER_API_KEY in production!
```

### Step 4: Update CORS (Production)

Edit `functions/src/index.ts`:
```typescript
// Change from:
res.set('Access-Control-Allow-Origin', '*');

// To your actual domain:
res.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

### Step 5: Deploy Client

```bash
npm run build
firebase deploy --only hosting
```

---

## Local Development Setup

For local development, you can use the direct OpenRouter provider:

```bash
# .env.local
VITE_OPENROUTER_API_KEY=sk-or-v1-your-dev-key

# WARNING: This key will be visible in browser
# Only use for testing, never commit to git
```

The app will show a console warning:
```
⚠️ Using direct OpenRouter provider. API key is exposed client-side!
   For production, use Firebase Functions proxy instead.
```

---

## Security Checklist for Production

- [ ] OpenRouter API key is set in Firebase config (server-side)
- [ ] `VITE_OPENROUTER_API_KEY` is NOT set in production .env
- [ ] `VITE_FIREBASE_FUNCTION_URL` points to deployed function
- [ ] CORS is restricted to your domain (not `*`)
- [ ] Firebase Functions are deployed
- [ ] Rate limiting is tested and working
- [ ] Medical disclaimer appears on first use
- [ ] Error messages don't expose sensitive details
- [ ] Usage monitoring is configured
- [ ] .env files are in .gitignore

---

## Monitoring & Maintenance

### View Firebase Function Logs
```bash
firebase functions:log
```

### Monitor Usage
Check logs for:
- High request volumes from single users/IPs
- Error rates
- Response times
- OpenRouter API usage costs

### Rate Limit Adjustments

Edit `functions/src/index.ts`:
```typescript
const MAX_REQUESTS_PER_USER = 10;  // Adjust as needed
const MAX_REQUESTS_PER_IP = 20;    // Adjust as needed
```

Redeploy:
```bash
firebase deploy --only functions
```

---

## Incident Response

### If API Key is Compromised

1. **Immediate**: Revoke key in OpenRouter dashboard
2. **Generate new key**
3. **Update Firebase config**:
   ```bash
   firebase functions:config:set openrouter.apikey="new-key"
   firebase deploy --only functions
   ```
4. **Monitor usage** for unusual activity

### If Abuse Detected

1. **Check logs** for user ID or IP
2. **Implement IP blocklist** in functions/src/index.ts
3. **Adjust rate limits** if needed
4. **Consider adding authentication** for additional protection

---

## Future Security Enhancements

### Recommended Improvements

1. **Persistent Rate Limiting**
   - Move from in-memory Map to Firestore or Redis
   - Survives function cold starts
   - Shared across function instances

2. **User Authentication**
   - Implement Firebase Auth
   - Tie rate limits to authenticated users
   - Better abuse prevention

3. **Content Filtering**
   - Server-side content moderation
   - Block inappropriate prompts
   - Detect medical emergency language

4. **API Key Rotation**
   - Automated key rotation schedule
   - Multiple keys with load balancing

5. **Advanced Monitoring**
   - Set up Cloud Monitoring alerts
   - Cost tracking and budgets
   - Anomaly detection

6. **DDoS Protection**
   - Cloud Armor integration
   - Geographic restrictions
   - Request signature verification

---

## Cost Optimization

### OpenRouter Free Tier Limits

- Model: `deepseek/deepseek-chat-v3.1:free`
- Check current limits at https://openrouter.ai/docs#limits

### Cost Monitoring

```bash
# View OpenRouter usage
# Log into OpenRouter dashboard

# Monitor Firebase costs
firebase billing:check
```

### Budget Alerts

Set up billing alerts in:
- OpenRouter dashboard
- Firebase console → Billing

---

## Testing

### Test Rate Limiting

```bash
# Client-side test
for i in {1..15}; do
  echo "Request $i"
  curl -X POST https://yourdomain.com/api/ai -d '{"prompt":"test"}' -H "Content-Type: application/json"
  sleep 1
done
```

### Test Input Validation

```bash
# Test max length
curl -X POST https://your-function-url/aiChat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"'$(python3 -c "print('x' * 501)")'"}'

# Expected: 400 error
```

### Test Security Headers

```bash
curl -I https://your-function-url/aiChat
# Check CORS headers
```

---

## Support & Questions

For security concerns or questions:
1. Review this document
2. Check Firebase Functions logs
3. Consult OpenRouter documentation
4. Review AI Integration docs in `AI_INTEGRATION.md`

---

**Last Updated**: 2025-11-18
**Version**: 1.0
**Maintainer**: Development Team
