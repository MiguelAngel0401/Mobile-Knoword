"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRefreshToken = void 0;
const common_1 = require("@nestjs/common");
exports.GetRefreshToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.['refresh-token'];
});
//# sourceMappingURL=getRefreshToken.decorator.js.map