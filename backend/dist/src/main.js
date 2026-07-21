"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        ...(process.env.FRONTEND_URLS?.split(',') ?? []),
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
    ]
        .map((origin) => origin?.trim())
        .filter(Boolean);
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const preferredPort = Number(process.env.PORT ?? 3000);
    try {
        await app.listen(preferredPort, '0.0.0.0');
        logger.log(`Backend đang chạy tại http://localhost:${preferredPort}/api`);
    }
    catch (error) {
        if (error.code !== 'EADDRINUSE') {
            throw error;
        }
        logger.error(`Port ${preferredPort} đang được sử dụng. Hãy tắt backend cũ hoặc đổi PORT trong .env.`);
        logger.error(`Kiểm tra process bằng: lsof -iTCP:${preferredPort} -sTCP:LISTEN -P -n`);
        await app.close();
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map