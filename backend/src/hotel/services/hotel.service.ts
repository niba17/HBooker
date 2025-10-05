import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateHotelDto } from "../dto/create-hotel.dto";
import { Hotel } from "@generated/prisma";

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  /**
   * Mengambil informasi Hotel H
   */
  async findHotelInfo(): Promise<Hotel> {
    // Karena hanya ada satu hotel, kita ambil yang pertama
    const hotel = await this.prisma.hotel.findFirst({
      include: { amenities: { include: { amenity: true } } },
    });

    if (!hotel) {
      throw new NotFoundException("Data Hotel H belum diinisialisasi.");
    }
    return hotel;
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

    const dataToSave = {
      name: dto.name,
      address: dto.address,
      city: dto.city,
      description: dto.description,
      rating: dto.rating,
    };

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
        include: { amenities: { include: { amenity: true } } },
      });
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
        include: { amenities: { include: { amenity: true } } },
      });
    }
  }
}
