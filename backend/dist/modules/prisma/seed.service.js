"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
let SeedService = class SeedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedAdmin();
    }
    async seedAdmin() {
        const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
        const adminEmail = `sanjay@${rootDomain}`;
        const password = 'Ksw@123';
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const existingAdmin = await this.prisma.client.user.findUnique({
                where: { email: adminEmail },
            });
            if (!existingAdmin) {
                console.log('--- Bootstrapping Initial Super Admin ---');
                const org = await this.prisma.client.organization.upsert({
                    where: { slug: 'ksw-hq' },
                    update: {},
                    create: {
                        name: 'KSWMS HQ',
                        slug: 'ksw-hq',
                        enabledModules: ['DASHBOARD', 'HOTEL_MANAGEMENT'],
                    },
                });
                await this.prisma.client.user.create({
                    data: {
                        email: adminEmail,
                        passwordHash,
                        name: 'Sanjay Kumar',
                        role: 'SUPER_ADMIN',
                        organizationId: org.id,
                    },
                });
                console.log(`Initial Admin Created: ${adminEmail} / ${password}`);
            }
            else {
                await this.prisma.client.user.update({
                    where: { email: adminEmail },
                    data: { passwordHash }
                });
                console.log(`Admin ${adminEmail} verified and password reset to default.`);
            }
        }
        catch (error) {
            console.error('Failed to seed initial admin:', error);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedService);
//# sourceMappingURL=seed.service.js.map