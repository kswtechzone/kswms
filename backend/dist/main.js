"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            const allowedOrigins = [
                'http://localhost:3000',
                `https://${rootDomain}`,
                `https://ms.${rootDomain}`,
                `https://api.${rootDomain}`,
                'https://kswtechzone.com.np',
                'https://ms.kswtechzone.com.np',
                'https://kswtechzone.com',
                'https://kswms.cloude',
                'https://ms.kswms.cloude',
                'https://api.kswms.cloude',
            ];
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            try {
                const parsedUrl = new URL(origin);
                const hostname = parsedUrl.hostname;
                const isAllowedSubdomain = hostname.endsWith(`.${rootDomain}`) ||
                    hostname.endsWith('.kswms.cloude') ||
                    hostname.endsWith('.kswtechzone.com.np') ||
                    hostname.endsWith('.kswtechzone.com');
                if (isAllowedSubdomain) {
                    callback(null, true);
                    return;
                }
            }
            catch (e) {
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 4000);
    console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map