import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatError extends Error {
  type: string;
  constructor(message: string, type: string) {
    super(message);
    this.type = type;
    this.name = 'ChatError';
  }
}

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new ChatError('Missing API key', 'api_key');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Rate limiting configuration
const rateLimiter = {
  lastCall: 0,
  minInterval: 2000, // 2 seconds between messages
  callsInLastMinute: 0,
  maxCallsPerMinute: 20,
  lastMinuteReset: Date.now(),
};

// Reset rate limiter counts every minute
setInterval(() => {
  rateLimiter.callsInLastMinute = 0;
  rateLimiter.lastMinuteReset = Date.now();
}, 60000);

const SYSTEM_PROMPT = `You are a helpful AI assistant for Hari's portfolio website. Your role is to:
1. Answer questions about Hari's skills, projects, and experience based on the following information
2. Help visitors navigate the portfolio
3. Provide professional and concise responses
4. Stay focused on topics related to Hari's professional background
5. If a question is not related to Hari's portfolio, politely redirect the conversation back to relevant topics

About Hari:
- Full-stack web developer with 3+ years experience
- Specializes in Node.js, Express.js, React, and JavaScript
- Led process improvement initiatives with 30% productivity gains
- Strong background in automation and workflow optimization

Technical Skills:
- Frontend: React, TypeScript, HTML, CSS, TailwindCSS
- Backend: Node.js, Express.js, RESTful APIs
- Database: MongoDB
- Tools: Git, GitHub, Vercel
- AI Integration: Gemini AI, ChatGPT, ClaudeAI

Notable Projects:
1. AI Voice Assistant (EchoLine)
2. Legal Legends Law Associates Website
3. Blog Web Application

Experience:
1. Web Manager at Ar Arazzaq Isotech (2021-2024)
2. Process Specialist at Cognizant (2015-2020)

Contact: harikrish120027@gmail.com
Website: https://harikrishnan-five.vercel.app/1

If a visitor asks about unrelated topics, politely guide them back to discussing Hari's portfolio, skills, or projects.`;

export async function getChatResponse(message: string): Promise<string> {
  try {
    const now = Date.now();

    // Check time since last message
    const timeSinceLastCall = now - rateLimiter.lastCall;
    if (timeSinceLastCall < rateLimiter.minInterval) {
      throw new ChatError(
        `Please wait ${Math.ceil((rateLimiter.minInterval - timeSinceLastCall) / 1000)} seconds before sending another message`,
        'rate_limit'
      );
    }

    // Check calls per minute
    if (now - rateLimiter.lastMinuteReset > 60000) {
      rateLimiter.callsInLastMinute = 0;
      rateLimiter.lastMinuteReset = now;
    }

    if (rateLimiter.callsInLastMinute >= rateLimiter.maxCallsPerMinute) {
      throw new ChatError(
        'Message limit reached. Please wait a minute before sending more messages.',
        'rate_limit'
      );
    }

    // Update rate limiter
    rateLimiter.lastCall = now;
    rateLimiter.callsInLastMinute++;

    // Generate response with context
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new ChatError('No response received', 'empty_response');
    }

    return text;
  } catch (error: unknown) {
    if (error instanceof ChatError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new ChatError('Invalid API key', 'api_key');
      }
      if (error.message.includes('network')) {
        throw new ChatError('Network error occurred', 'network');
      }
      throw new ChatError(error.message, 'unknown');
    }
    
    throw new ChatError('An unexpected error occurred', 'unknown');
  }
}
