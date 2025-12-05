"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://192.168.1.214:3000',
            /^http:\/\/192\.168\.1\.\d+/,
            'http://192.168.1.214:8081',
            'http://localhost:8081',
            'https://unpleading-lawfully-coy.ngrok-free.dev',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'ngrok-skip-browser-warning',
            'User-Agent',
            'Cookie',
        ],
        exposedHeaders: ['Set-Cookie'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use((0, cookie_parser_1.default)());
    await app.listen(8000, '0.0.0.0');
    console.log('🚀 Backend corriendo en http://0.0.0.0:8000');
}
bootstrap();
//# sourceMappingURL=main.js.map