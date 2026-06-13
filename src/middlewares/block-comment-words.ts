const LOOKALIKE_MAP: Record<string, string> = {
  // Cyrillic → latin
  'а': 'a', 'А': 'a',
  'в': 'b', 'В': 'b',
  'е': 'e', 'Е': 'e',
  'ё': 'e', 'Ё': 'e',
  'з': 'z', 'З': 'z',
  'и': 'u', 'И': 'u',
  'к': 'k', 'К': 'k',
  'м': 'm', 'М': 'm',
  'н': 'h', 'Н': 'h',
  'о': 'o', 'О': 'o',
  'р': 'p', 'Р': 'p',
  'с': 'c', 'С': 'c',
  'т': 't', 'Т': 't',
  'у': 'y', 'У': 'y',
  'х': 'x', 'Х': 'x',
  'ъ': '',  'Ъ': '',
  'ь': '',  'Ь': '',
  // Number/symbol substitutions
  '0': 'o',
  '3': 'з',
  '@': 'a',
  '$': 's',
  '1': 'i',
  '!': 'i',
};

const normalizeChar = (ch: string): string => LOOKALIKE_MAP[ch] ?? ch.toLowerCase();
 
const normalizeToken = (token: string): string =>
  token.split('').map(normalizeChar).join('');
 
const tokenize = (text: string): string[] =>
  text
    .split(/[\s\-_.,!?*"'()\[\]{}<>\/\\|]+/)
    .map(normalizeToken)
    .filter(Boolean);
 
export default (config: { blockedWords?: string[] }, { strapi }: { strapi: any }) => {
  const rawWords = config.blockedWords ?? [];
  const blockedWords = rawWords.map(normalizeToken);
 
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.url.startsWith('/admin') || !ctx.url.startsWith('/api/comments')) {
      await next();
      return;
    }
 
    if (!['POST', 'PUT', 'PATCH'].includes(ctx.method?.toUpperCase())) {
      await next();
      return;
    }
 
    if (!blockedWords.length) {
      await next();
      return;
    }
 
    const content: string = ctx.request.body?.content ?? '';
 
    if (!content) {
      await next();
      return;
    }
 
    const tokens = tokenize(content);
    const matched = tokens.find((token) => blockedWords.includes(token));
 
    if (matched) {
      ctx.status = 400;
      ctx.body = {
        error: {
          status: 400,
          name: 'BadRequestError',
          message: 'Your comment contains a word that is not allowed.',
        },
      };
      return;
    }
 
    await next();
  };
};
