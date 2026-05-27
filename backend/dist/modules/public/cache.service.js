"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ttlSeconds) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { value, expiresAt });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clearTenantCache(slug) {
        console.log(`🧹 CQRS Invalidation: Clearing cached reads for tenant slug: "${slug}"`);
        for (const key of this.cache.keys()) {
            if (key.includes(`:${slug}`)) {
                this.cache.delete(key);
            }
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map