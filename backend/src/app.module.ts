import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { HotelModule } from "../src/hotel/modules/hotel.module";
// Impor modul lain di sini seiring proyek berkembang

@Module({
  imports: [
    // Wajib: Memuat file .env untuk konfigurasi
    ConfigModule.forRoot({ isGlobal: true }),

    // Modul Prisma (Database)
    PrismaModule,

    // Modul Hotel
    HotelModule,

    // Tambahkan modul fitur Anda di sini
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
