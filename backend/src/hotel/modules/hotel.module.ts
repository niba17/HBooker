import { Module } from "@nestjs/common";
import { HotelController } from "../controllers/hotel.controller";
import { HotelService } from "../services/hotel.service";
import { PrismaModule } from "../../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}
