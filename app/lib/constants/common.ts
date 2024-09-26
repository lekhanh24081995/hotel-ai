import dayjs from 'dayjs';
import ENDPOINTS from '../endpoints';

interface CookieConfig {
  secure: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path: string;
  expires: Date;
  httpOnly?: boolean;
  priority: 'low' | 'medium' | 'high';
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const APP_API_KEY = process.env.APP_API_KEY;

const STORAGE_KEY_PREFIX = '@HOTEL/';

const STORAGE_KEYS = {
  ACCESS_TOKEN: `${STORAGE_KEY_PREFIX}access_token`,
  REFRESH_TOKEN: `${STORAGE_KEY_PREFIX}refresh_token`,
  IS_AUTHENTICATED: `${STORAGE_KEY_PREFIX}is_authenticated`
};

const COOKIE_CONFIG: CookieConfig = {
  secure: true,
  sameSite: 'none',
  path: '/',
  expires: dayjs().add(1, 'month').toDate(),
  httpOnly: true,
  priority: 'high'
};

const LIST_ROUTER = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  EMAIL_VERIFICATION: '/email-verification',
  TERM: '/terms-of-service',
  POLICY: '/privacy-policy',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  HOTEL: '/dashboard/hotel',
  DESTINATION: '/dashboard/destination',
  CHAT: '/dashboard/chat',
  CHATBOT: '/dashboard/chatbot',
  RESTAURANT: '/dashboard/restaurant',
  TOOL: '/dashboard/tool',
  SETTINGS: '/dashboard/settings',
  SHARE: '/share'
};

const MAILTRAP = {
  HOST: process.env.MAILTRAP_HOST,
  PORT: process.env.MAILTRAP_PORT,
  USER: process.env.MAILTRAP_USER,
  PASSWORD: process.env.MAILTRAP_PASSWORD
};

const REQUIRED_TOKEN_ENDPOINTS = [ENDPOINTS.PROFILE, ENDPOINTS.LOGOUT];
const REQUIRED_API_KEY_ENDPOINTS = [ENDPOINTS.USERS];

const LOCAL_STORAGE_KEY = {
  SIDEBAR: 'sidebar'
};

const MIDDLEWARE_CONFIG = {
  DEFAULT: '/((?!static|.*\\..*|_next).*)|/api/:path*',
  I18N: '^(?!/api)(?!.*(/static|\\..*|_next)).*'
};

const AI_MODELS = {
  LLAMA: {
    name: 'LLaMA',
    version: 'llama-3.1-70b-versatile'
  },
  GEMINI: {
    name: 'Gemini',
    version: 'gemini-1.5-pro-latest'
  },
  CHATGPT: {
    name: 'ChatGPT',
    version: 'gpt-4-turbo'
  }
};

const LIST_AI_MODELS = Object.values(AI_MODELS).map((model) => model.name);

export {
  APP_URL,
  APP_API_KEY,
  STORAGE_KEYS,
  COOKIE_CONFIG,
  LIST_ROUTER,
  REQUIRED_TOKEN_ENDPOINTS,
  REQUIRED_API_KEY_ENDPOINTS,
  MAILTRAP,
  LOCAL_STORAGE_KEY,
  MIDDLEWARE_CONFIG,
  AI_MODELS,
  LIST_AI_MODELS
};
