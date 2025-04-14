import { TOKEN_SECRET } from '@env';

export async function authFetch(input: RequestInfo, init: RequestInit = {}) { 
    const authHeaders = {
      ...(init.headers || {}),
      Authorization: `Bearer ${TOKEN_SECRET || ''}`,
    };
  console.log("here");
  
    return fetch(input, {
      ...init,
      headers: authHeaders,
    });
  }
  