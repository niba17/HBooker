import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * PrismaService bertindak sebagai koneksi tunggal dan manajer siklus hidup
 * untuk PrismaClient di seluruh aplikasi NestJS.
 * Ini memastikan koneksi database dibuka saat modul diinisialisasi (OnModuleInit)
 * dan ditutup saat modul dihancurkan (OnModuleDestroy).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Konstruktor: Anda dapat menambahkan konfigurasi logging di sini jika diperlukan.
   * Contoh: super({ log: ['query', 'info', 'warn', 'error'] });
   */
  constructor() {
    super();
  }

  /**
   * Dipanggil saat modul diinisialisasi.
   * Digunakan untuk membuat koneksi ke database.
   */
  async onModuleInit() {
    // Menghubungkan (connect) ke database
    await this.$connect();
    console.log("Prisma connected to the database.");
  }

  /**
   * Dipanggil saat modul dihancurkan.
   * Digunakan untuk memutus koneksi database.
   */
  async onModuleDestroy() {
    // Memutus koneksi (disconnect) dari database
    await this.$disconnect();
    console.log("Prisma disconnected from the database.");
  }
}
