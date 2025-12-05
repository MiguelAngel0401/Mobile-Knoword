"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const email_module_1 = require("./email/email.module");
const users_module_1 = require("./users/users.module");
const redis_module_1 = require("./redis/redis.module");
const communities_module_1 = require("./communities/communities.module");
const app_controllers_1 = require("./app.controllers");
const posts_module_1 = require("./posts/posts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule,
            users_module_1.UsersModule,
            redis_module_1.RedisModule,
            communities_module_1.CommunitiesModule,
            posts_module_1.PostsModule,
        ],
        controllers: [app_controllers_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map