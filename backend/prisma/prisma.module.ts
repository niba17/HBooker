import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * Modul Prisma mendeklarasikan dan mengekspor PrismaService,
 * menjadikannya tersedia secara global di seluruh aplikasi.
 * Ini mencegah kebutuhan untuk mengimpornya berulang kali di setiap modul.
 */
@Global()
@Module({
  // PrismaService disediakan (provided) di sini
  providers: [PrismaService],

  // PrismaService diekspor (exported) agar dapat di-inject di modul lain
  exports: [PrismaService],
})
export class PrismaModule {}
