/**
 * Centralized API & Networking Configuration
 * Supports dynamic environment variables, build-time overrides, and multi-tenant header management.
 */

// Resolve raw URL and port from Next.js environment configuration
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const apiPort = process.env.NEXT_PUBLIC_API_PORT || '4000';

// Check if we are in a browser environment to resolve API_BASE_URL dynamically if needed
let resolvedApiUrl = rawApiUrl;

if (typeof window !== 'undefined') {
  const currentHostname = window.location.hostname;
  const currentProtocol = window.location.protocol;

  // If the API URL is empty, localhost, or 127.0.0.1, check if we are accessing the app via a public domain/IP
  if (!rawApiUrl || rawApiUrl.includes('localhost') || rawApiUrl.includes('127.0.0.1')) {
    if (currentHostname !== 'localhost' && currentHostname !== '127.0.0.1') {
      const isIp = currentHostname.match(/^\d+\.\d+\.\d+\.\d+$/);
      if (!isIp) {
        // Central platform domains
        const platformDomains = ['kswms.cloud', 'kswtechzone.com.np', 'kswtechzone.com', 'kswms.cloude'];
        const matchedDomain = platformDomains.find(domain => currentHostname.endsWith(domain));
        
        if (matchedDomain) {
          // Dynamic subdomain mapping for platform (e.g. ms.kswms.cloud -> api.kswms.cloud)
          if (currentHostname.startsWith('ms.')) {
            resolvedApiUrl = `${currentProtocol}//api.${currentHostname.substring(3)}`;
          } else if (currentHostname.startsWith('www.')) {
            resolvedApiUrl = `${currentProtocol}//api.${currentHostname.substring(4)}`;
          } else {
            // E.g. tenant1.kswms.cloud -> api.kswms.cloud
            resolvedApiUrl = `${currentProtocol}//api.${matchedDomain}`;
          }
        } else {
          // Custom domain (e.g. glamstudio.com) -> point to centralized backend API endpoint
          resolvedApiUrl = `${currentProtocol}//api.kswms.cloud`;
        }
      } else {
        // Dynamic IP-based mapping for hosting without a registered domain (e.g. http://<VPS_IP>:4000)
        resolvedApiUrl = `${currentProtocol}//${currentHostname}:${apiPort}`;
      }
    }
  }
}

// Clean trailing slash and extract root hostname (supporting both /api/v1 prefix inclusion or direct root)
export const API_BASE_URL = resolvedApiUrl.endsWith('/api/v1') 
  ? resolvedApiUrl.substring(0, resolvedApiUrl.length - 7) 
  : resolvedApiUrl.replace(/\/$/, '');

// Static build environment validation check
if (process.env.NODE_ENV === 'production') {
  if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
    console.warn(
      `⚠️ WARNING: Production build detected using a LOCALHOST API endpoint: "${API_BASE_URL}". ` +
      `Ensure NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_PORT is properly configured in your deployment settings.`
    );
  } else {
    console.log(`🌐 API Client initialized successfully targeting: "${API_BASE_URL}"`);
  }
}

/**
 * Enhanced fetch client helper. Pre-configures base URLs, standard headers,
 * authentication states, and tenant context.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // 1. Normalize endpoint path and combine with API_BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Clean endpoint prefix to avoid double-prefixing if absolute URL is accidentally supplied
  let targetUrl = `${API_BASE_URL}${cleanEndpoint}`;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    targetUrl = endpoint;
  }

  // 2. Extract Authorization token and Tenant ID from storage
  let token: string | null = null;
  let tenantId: string | null = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    // Resolve organization ID from saved user state
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        tenantId = parsed.organization?.id || parsed.organizationId || null;
      } catch (e) {
        console.error('Failed to parse user organization context from localStorage:', e);
      }
    }
  }

  // 3. Prepare headers
  const headers = new Headers(options.headers || {});
  
  // Inject default application/json header unless overridden (e.g., for FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Authorization JWT
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Inject multi-tenant identifier
  if (tenantId && !headers.has('x-tenant-id')) {
    headers.set('x-tenant-id', tenantId);
  }

  // 4. Perform network request
  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Standard HTTP GET helper
 */
export async function getRequest(endpoint: string, options: RequestInit = {}) {
  return apiFetch(endpoint, { ...options, method: 'GET' });
}

/**
 * Standard HTTP POST helper
 */
export async function postRequest(endpoint: string, body: any, options: RequestInit = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * Standard HTTP PUT helper
 */
export async function putRequest(endpoint: string, body: any, options: RequestInit = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * Standard HTTP PATCH helper
 */
export async function patchRequest(endpoint: string, body?: any, options: RequestInit = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });
}

/**
 * Standard HTTP DELETE helper
 */
export async function deleteRequest(endpoint: string, options: RequestInit = {}) {
  return apiFetch(endpoint, { ...options, method: 'DELETE' });
}
