"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
let PrismaService = class PrismaService {
    constructor() {
        const maxConnections = process.env.DATABASE_POOL_MAX ? parseInt(process.env.DATABASE_POOL_MAX) : 20;
        const idleTimeout = process.env.DATABASE_IDLE_TIMEOUT ? parseInt(process.env.DATABASE_IDLE_TIMEOUT) : 30000;
        const connectionTimeout = process.env.DATABASE_CONN_TIMEOUT ? parseInt(process.env.DATABASE_CONN_TIMEOUT) : 5000;
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: maxConnections,
            idleTimeoutMillis: idleTimeout,
            connectionTimeoutMillis: connectionTimeout
        });
        pool.on('error', (err) => {
            console.error('Unexpected database adapter connection pool error:', err);
        });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        const baseClient = new client_1.PrismaClient({ adapter });
        const softDeleteModels = [
            'Organization', 'Brand', 'User', 'Hotel', 'Room', 'Booking',
            'Website', 'Restaurant'
        ];
        this.client = baseClient.$extends({
            query: {
                $allModels: {
                    async findMany({ model, args, query }) {
                        if (softDeleteModels.includes(model)) {
                            args.where = { deletedAt: null, ...args.where };
                        }
                        return query(args);
                    },
                    async findFirst({ model, args, query }) {
                        if (softDeleteModels.includes(model)) {
                            args.where = { deletedAt: null, ...args.where };
                        }
                        return query(args);
                    },
                    async findUnique({ args, query }) {
                        return query(args);
                    }
                }
            }
        });
    }
    async onModuleInit() {
        await this.client.$connect();
    }
    async onModuleDestroy() {
        await this.client.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map