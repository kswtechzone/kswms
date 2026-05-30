import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';

import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  
  const prisma = app.get(PrismaService);
  const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
  const frontendPort = process.env.FRONTEND_PORT || '3000';
  
  app.enableCors({
    origin: async (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      
      const allowedOrigins = [
        `http://localhost:${frontendPort}`,
        'http://localhost:3000', // Default fallback
        `https://${rootDomain}`,
        `http://${rootDomain}`,
        `https://ms.${rootDomain}`,
        `http://ms.${rootDomain}`,
        `https://api.${rootDomain}`,
        `http://api.${rootDomain}`,
        'https://kswtechzone.com.np',
        'http://kswtechzone.com.np',
        'https://ms.kswtechzone.com.np',
        'http://ms.kswtechzone.com.np',
        'https://kswtechzone.com',
        'http://kswtechzone.com',
        'https://kswms.cloude',
        'http://kswms.cloude',
        'https://ms.kswms.cloude',
        'http://ms.kswms.cloude',
        'https://api.kswms.cloude',
        'http://api.kswms.cloude',
      ];
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      
      try {
        const parsedUrl = new URL(origin);
        const hostname = parsedUrl.hostname;
        
        const isAllowedSubdomain = 
          hostname.endsWith(`.${rootDomain}`) ||
          hostname.endsWith('.kswms.cloude') ||
          hostname.endsWith('.kswtechzone.com.np') ||
          hostname.endsWith('.kswtechzone.com');
          
        if (isAllowedSubdomain) {
          callback(null, true);
          return;
        }

        // Dynamically allow registered tenant custom domains from database
        const website = await prisma.client.website.findUnique({
          where: { customDomain: hostname },
          select: { id: true }
        });
        
        if (website) {
          callback(null, true);
          return;
        }
      } catch (e) {
        // Ignore invalid URL or database lookup errors
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
