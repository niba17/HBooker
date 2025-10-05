import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

// PATH ASLI: import { PrismaService } from "../../../prisma/prisma.service";
// PERBAIKAN PATH: Menggunakan path relatif yang sesuai (asumsi service berada di src/hotel/services)
import { PrismaService } from "../../../prisma/prisma.service";
// Jika Anda sudah mengaktifkan path alias di tsconfig, Anda bisa menggunakan: import { PrismaService } from '@prisma/prisma.service';

import { CreateHotelDto } from "../dto/create-hotel.dto";
import { Hotel } from "@generated/prisma"; // Menggunakan alias

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  // Daftar lengkap field skalar Model Hotel yang harus disertakan di setiap SELECT/INCLUDE
  private hotelSelectFields = {
    id: true,
    name: true,
    description: true,
    address: true,
    city: true,
    country: true,
    rating: true,
    createdAt: true,
    updatedAt: true,
  };

  /**
   * Mengambil informasi Hotel H
   */
  async findHotelInfo(): Promise<Hotel> {
    // Karena hanya ada satu hotel, kita ambil yang pertama
    const hotel = await this.prisma.hotel.findFirst({
      select: {
        ...this.hotelSelectFields, // Tambahkan semua field dasar
        amenities: { include: { amenity: true } },
      },
    });

    if (!hotel) {
      throw new NotFoundException("Data Hotel H belum diinisialisasi.");
    }
    // TS2739 teratasi karena semua field dasar sekarang ada di objek 'hotel'
    return hotel as Hotel;
  }

  /**
   * Mengambil semua daftar Amenity (fasilitas)
   */
  async findAllAmenities() {
    return this.prisma.amenity.findMany();
  }

  /**
   * Membuat atau memperbarui informasi Hotel H
   * Hanya boleh ada satu data hotel.
   */
  async createOrUpdateHotel(dto: CreateHotelDto): Promise<Hotel> {
    // Cek apakah hotel sudah ada
    const existingHotel = await this.prisma.hotel.findFirst();
    const hotelId = existingHotel?.id;

    // 1. Tangani Fasilitas (Amenities)
    const amenityConnect = [];
    if (dto.amenityNames && dto.amenityNames.length > 0) {
      // Pastikan semua fasilitas yang diminta ada. Jika tidak ada, buat.
      for (const name of dto.amenityNames) {
        let amenity = await this.prisma.amenity.findUnique({ where: { name } });
        if (!amenity) {
          amenity = await this.prisma.amenity.create({ data: { name } });
        }
        amenityConnect.push(amenity.id);
      }
    }

    // Pisahkan data hotel dari array amenityNames
    const { amenityNames, ...dataToSave } = dto;

    // Periksa jika hotelId ada, lakukan UPDATE
    if (hotelId) {
      // UPDATE (Jika hotel sudah ada)
      // Hapus koneksi amenities lama sebelum membuat koneksi baru
      await this.prisma.hotelAmenity.deleteMany({ where: { hotelId } });

      return this.prisma.hotel.update({
        where: { id: hotelId },
        data: {
          ...dataToSave,
          amenities: {
            createMany: {
              data: amenityConnect.map((amenityId) => ({ amenityId })),
              skipDuplicates: true,
            },
          },
        },
        // PERBAIKAN: Gunakan SELECT
        select: {
          ...this.hotelSelectFields,
          amenities: { include: { amenity: true } },
        },
      }) as unknown as Hotel;
    } else {
      // CREATE (Jika hotel belum ada)
      return this.prisma.hotel.create({
        data: {
          ...dataToSave,
          amenities: {
            createMany: {
              data: amenityConnect.map((amenityId) => ({ amenityId })),
              skipDuplicates: true,
            },
          },
        },
        // PERBAIKAN: Gunakan SELECT
        select: {
          ...this.hotelSelectFields,
          amenities: { include: { amenity: true } },
        },
      }) as unknown as Hotel;
    }
  }
}
