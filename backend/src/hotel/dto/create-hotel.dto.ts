import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ArrayUnique,
} from "class-validator";

/**
 * DTO untuk membuat atau memperbarui data Hotel H.
 * Asumsi: Ini dijalankan oleh Admin atau saat inisialisasi aplikasi (seeding).
 */
export class CreateHotelDto {
  @IsString()
  @IsNotEmpty({ message: "Nama hotel tidak boleh kosong." })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Alamat tidak boleh kosong." })
  address: string;

  @IsString()
  @IsNotEmpty({ message: "Kota tidak boleh kosong." })
  city: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: "Rating minimal 0." })
  // Rating ini biasanya dihitung, tapi bisa diisi manual untuk seeding
  rating?: number;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  // Daftar fasilitas yang akan dihubungkan ke hotel (misalnya: ['WiFi', 'Pool'])
  amenityNames?: string[];
}
