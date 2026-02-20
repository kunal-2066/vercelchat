# Mindpex Chatbot - Setup Guide

## 🎯 Quick Start

### 1. Get Your Anthropic API Key

You have two options to get your API key:

#### Option A: Direct from Console (Easiest)
1. Go to [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Sign in or create an account
3. Click "Create Key"
4. Copy the API key

#### Option B: Using Organizations API
If you want to retrieve an existing key:
```bash
curl https://api.anthropic.com/v1/organizations/api_keys/YOUR_KEY_ID \
    -H "X-Api-Key: YOUR_ADMIN_API_KEY"
```

### 2. Configure Environment Variables

1. Open `.env.local` file in the root directory
2. Add your API key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000)

## 🎨 Features Overview

### Empathy System
The chatbot uses a comprehensive empathy framework based on:
- **Mirroring**: Reflects emotional states
- **Validation**: Affirms feelings
- **Containment**: Holds space for emotions
- **Guided Clarity**: Helps identify patterns
- **Empowerment**: Builds self-discovery

### Emotional Mode Detection
The AI automatically detects:
- **Venting Mode**: User needs emotional presence (mirroring, validation)
- **Solution Mode**: User is ready for guidance and action steps

### UI/UX Features
- Real-time streaming responses
- Message history persistence (localStorage)
- Export conversations as text files
- Suggested conversation starters
- Golden Mindpex theme throughout
- Responsive design (mobile, tablet, desktop)

## 🔧 Configuration

### Model Selection
Currently using **Claude 3 Haiku** (`claude-3-haiku-20240307`):
- Fast responses (~1-2 seconds)
- Cost-effective
- Excellent for empathetic conversations

To change the model, edit `src/api/chat.ts`:
```typescript
model: anthropic('claude-3-haiku-20240307')
// Options: 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022'
```

### System Prompt Customization
Edit the empathy framework in `src/utils/empathyPrompt.ts` to customize:
- Tone and language style
- Emotional modes
- Common scenarios
- Response patterns

### Theme Colors
Modify Mindpex colors in `tailwind.config.js`:
```javascript
mindpex: {
  gold: '#B58342',           // Primary golden color
  'gold-light': '#d4a05a',   // Lighter golden accent
  dark: '#000000',           // Pure black
  'dark-gray': '#1a1a1a',    // Dark gray
  'dark-gray-light': '#2a2a2a', // Lighter dark gray
}
```

## 📦 Build for Production

1. **Build the application**:
```bash
npm run build
```

2. **Preview production build**:
```bash
npm run preview
```

3. **Deploy**: Upload the `dist` folder to your hosting service

### ⚠️ Production Security Note
The current setup exposes the API key in the frontend. For production:

**Option 1: Backend Proxy (Recommended)**
- Create a Node.js/Express backend
- Store API key on server
- Frontend calls your backend API
- Backend calls Anthropic API

**Option 2: Serverless Functions**
- Use Vercel/Netlify functions
- Store API key in environment variables
- Create API route that proxies requests

**Option 3: Next.js API Routes**
- Convert to Next.js project
- Use API routes for backend logic
- Store keys server-side

## 🧪 Testing Scenarios

Test the chatbot with these scenarios:

### Venting Mode Tests
- "I'm so frustrated with my manager..."
- "Today was overwhelming, I had back-to-back meetings..."
- "I feel like nobody appreciates my work"

### Solution Mode Tests
- "How can I handle conflict with my boss?"
- "What should I do about this burnout?"
- "I need help organizing my workload"

### Emotional Support Tests
- "I'm feeling lonely at work"
- "I don't feel valued by my team"
- "I'm exhausted and don't know what to do"

## 🎯 Common Issues

### Issue: API Key Not Working
**Solution**:
- Verify key starts with `sk-ant-`
- Check for extra spaces or quotes
- Ensure `.env.local` file is in root directory
- Restart dev server after changing environment variables

### Issue: Streaming Not Working
**Solution**:
- Check browser console for errors
- Verify API key has necessary permissions
- Ensure internet connection is stable

### Issue: Messages Not Persisting
**Solution**:
- Check browser's localStorage is enabled
- Clear browser cache and try again
- Open DevTools > Application > Local Storage

## 🚀 Future Enhancements

### Phase 2 Features
- **HR Dashboard**: Aggregate emotional data for insights
- **Analytics**: Burnout signals, culture patterns, manager risks
- **Authentication**: Track individual employee journeys
- **Voice Input/Output**: Hands-free emotional support
- **Mood Tracking**: Visual emotional journey representation
- **Multi-conversation**: Start new emotional check-ins

### Hooked Model Integration
- **Employee Loop**: Infinite variability, unpredictable empathy
- **HR Loop**: Predictive insights with strong agency

## 📞 Support

For questions or issues:
- Check the [README.md](README.md) for detailed documentation
- Review the plan file: `.claude/plans/async-gliding-karp.md`
- Contact Mindpex support team

## 📝 Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

**Mindpex Intelligence Systems** © 2025

*Creating sanctuaries for emotional well-being in the workplace*
