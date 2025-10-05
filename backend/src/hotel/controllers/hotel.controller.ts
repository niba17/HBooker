import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

import { HotelService } from "../services/hotel.service";
import { CreateHotelDto } from "../dto/create-hotel.dto";

// PERBAIKAN PATH: Menggunakan alias @auth (sesuai tsconfig.json)
import { Public } from "@auth/decorators/public.decorator";

// PERBAIKAN PATH: Menggunakan alias @generated (sesuai tsconfig.json)
import { Hotel } from "@generated/prisma";

@Controller("hotel")
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  /**
   * [PUBLIC] GET /hotel
   * Mendapatkan informasi dasar Hotel H
   */
  @Public()
  @Get()
  async getHotelInfo(): Promise<Hotel> {
    return this.hotelService.findHotelInfo();
  }

  /**
   * [PUBLIC] GET /hotel/amenities
   * Mendapatkan daftar semua fasilitas
   */
  @Public()
  @Get("amenities")
  async getAllAmenities() {
    return this.hotelService.findAllAmenities();
  }

  /**
   * [ADMIN ONLY] POST /hotel
   * Membuat atau memperbarui data Hotel H
   */
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createOrUpdateHotel(
    @Body() createHotelDto: CreateHotelDto
  ): Promise<Hotel> {
    return this.hotelService.createOrUpdateHotel(createHotelDto);
  }
}
