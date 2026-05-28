import { Injectable, NestMiddleware, ServiceUnavailableException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../modules/prisma/prisma.service';

interface CachedTenant {
  id: string;
  organizationId: string;
}

interface CacheEntry {
  value: CachedTenant | null;
  expiry: number;
}

class TenantCache {
  private cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor() {
    const configuredTtl = process.env.TENANT_CACHE_TTL_MS ? parseInt(process.env.TENANT_CACHE_TTL_MS, 10) : 300000;
    this.ttlMs = isNaN(configuredTtl) ? 300000 : configuredTtl;
  }

  get(key: string): CachedTenant | null | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: CachedTenant | null): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttlMs,
    });
  }
}

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantResolverMiddleware.name);
  private readonly tenantCache = new TenantCache();

  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const hostHeader = req.headers['x-tenant-host'] || req.headers.host || '';
    const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

    const subdomain = host.split('.')[0];
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    // 1. Bypass check for system subdomains first
    if (!isLocalhost) {
      const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
      const isCustomDomain = 
          !host.includes(rootDomain) && 
          !host.includes('kswms.cloude') && 
          !host.includes('kswtechzone.com.np') && 
          !host.includes('kswtechzone.com'); 
      
      if (!isCustomDomain && ['kswms', 'ms', 'api', 'www', 'admin'].includes(subdomain)) {
          return next();
      }
    }

    // 2. Cache Lookup
    const cached = this.tenantCache.get(host);
    if (cached !== undefined) {
      if (cached) {
        (req as any).resolvedTenantId = cached.organizationId;
        (req as any).resolvedWebsiteId = cached.id;
      }
      return next();
    }

    let website = null;

    // 3. Database Lookup with Robust Error Handling
    try {
      if (isLocalhost) {
         // Development fallback or pass-through
         if (subdomain !== 'localhost' && subdomain !== '127') {
             website = await this.prisma.client.website.findUnique({
                 where: { subdomain }
             });
         }
      } else {
          // Production resolution
          const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
          const isCustomDomain = 
              !host.includes(rootDomain) && 
              !host.includes('kswms.cloude') && 
              !host.includes('kswtechzone.com.np') && 
              !host.includes('kswtechzone.com'); 
          if (isCustomDomain) {
              website = await this.prisma.client.website.findUnique({
                  where: { customDomain: host }
              });
          } else {
              website = await this.prisma.client.website.findUnique({
                  where: { subdomain }
              });
          }
      }

      // 4. Cache & Request Context Population
      if (website) {
        const cachedValue: CachedTenant = {
          id: website.id,
          organizationId: website.organizationId,
        };
        this.tenantCache.set(host, cachedValue);
        (req as any).resolvedTenantId = website.organizationId;
        (req as any).resolvedWebsiteId = website.id;
      } else {
        // Negative caching to prevent unmapped subdomains/hosts from hammering DB
        this.tenantCache.set(host, null);
      }

    } catch (error) {
      this.logger.error(`Database error during tenant resolution for host [${host}]:`, error);
      throw new ServiceUnavailableException('Database service is temporarily unavailable. Please try again later.');
    }

    next();
  }
}

