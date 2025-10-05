import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Fungsi bootstrap untuk memulai aplikasi NestJS.
 * Fungsi ini adalah titik masuk utama (entry point) aplikasi.
 */
async function bootstrap() {
  // Membuat instance aplikasi NestJS
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan fitur CORS untuk memungkinkan akses dari frontend
  app.enableCors();

  // Menjalankan aplikasi pada port 3000 (port standar NestJS)
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Aplikasi NestJS berjalan di: http://localhost:${PORT}`);
}

// Memanggil fungsi bootstrap
bootstrap().catch((err) => {
  console.error("Gagal memulai aplikasi:", err);
});
