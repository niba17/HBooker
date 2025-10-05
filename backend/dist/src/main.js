"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`Aplikasi NestJS berjalan di: http://localhost:${PORT}`);
}
bootstrap().catch((err) => {
    console.error("Gagal memulai aplikasi:", err);
});
//# sourceMappingURL=main.js.map