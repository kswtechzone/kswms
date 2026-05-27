"use strict";
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, notificationService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(data) {
        this.logger.log(`Registering new user: ${data.email} with profile type: ${data.profileType || 'ORGANIZATION'}`);
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        const isUserType = data.profileType === 'USER';
        if (!isUserType) {
            if (!data.orgSlug) {
                throw new common_1.BadRequestException('Organization slug is required');
            }
            const existingOrg = await this.prisma.client.organization.findUnique({
                where: { slug: data.orgSlug },
            });
            if (existingOrg) {
                throw new common_1.ConflictException('This organization URL slug is already taken');
            }
        }
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const result = await this.prisma.client.$transaction(async (tx) => {
                let org;
                if (isUserType) {
                    org = await tx.organization.findUnique({
                        where: { slug: 'kswuser' },
                    });
                    if (!org) {
                        org = await tx.organization.create({
                            data: {
                                name: 'KSWUSER Organization',
                                slug: 'kswuser',
                                enabledModules: ['DASHBOARD'],
                                brands: {
                                    create: {
                                        name: 'KSWUSER',
                                        slug: 'kswuser',
                                    },
                                },
                            },
                        });
                    }
                }
                else {
                    org = await tx.organization.create({
                        data: {
                            name: data.orgName,
                            slug: data.orgSlug,
                            enabledModules: ['DASHBOARD'],
                            brands: {
                                create: {
                                    name: data.orgName,
                                    slug: data.orgSlug,
                                },
                            },
                        },
                    });
                }
                const user = await tx.user.create({
                    data: {
                        email: data.email,
                        passwordHash: hashedPassword,
                        name: data.name,
                        organizationId: org.id,
                        role: 'ORG_ADMIN',
                    },
                    include: { organization: true }
                });
                return user;
            });
            this.logger.log(`Successfully registered: ${data.email}`);
            try {
                await this.notificationService.createNotification(data.email, 'Welcome to KSW Hospitality!', `Hello ${data.name || 'User'}, your ${isUserType ? 'individual guest' : 'business management'} account has been registered successfully.`);
            }
            catch (e) {
                this.logger.error(`Failed to trigger welcome notification: ${e.message}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Registration failed: ${error.message}`);
            throw new common_1.BadRequestException('Registration failed. Please ensure all data is valid.');
        }
    }
    async login(email, pass) {
        this.logger.log(`Login attempt: ${email}`);
        try {
            const user = await this.prisma.client.user.findUnique({
                where: { email },
                include: { organization: true },
            });
            if (!user) {
                this.logger.warn(`Login failed: User ${email} not found`);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            if (!isMatch) {
                this.logger.warn(`Login failed: Password mismatch for ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                orgId: user.organizationId,
                role: user.role
            };
            this.logger.log(`Login successful: ${email}`);
            return {
                accessToken: await this.jwtService.signAsync(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    organization: user.organization,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login error: ${error.message}`);
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.BadRequestException('Login failed due to a system error');
        }
    }
    async getLoyaltyPoints(email) {
        if (!email) {
            return [];
        }
        const customer = await this.prisma.client.customer.findFirst({
            where: { email },
            include: {
                organizations: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        });
        if (!customer) {
            return [];
        }
        return customer.organizations.map((orgLink) => ({
            organizationName: orgLink.organization?.name || 'Partner Merchant',
            organizationSlug: orgLink.organization?.slug || '',
            loyaltyPoints: orgLink.loyaltyPoints || 0,
            notes: orgLink.notes,
            tags: orgLink.tags,
        }));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        notification_service_1.NotificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map