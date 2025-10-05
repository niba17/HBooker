import { PrismaService } from "../../../prisma/prisma.service";
import { CreateHotelDto } from "../dto/create-hotel.dto";
import { Hotel } from "@generated/prisma";
export declare class HotelService {
    private prisma;
    constructor(prisma: PrismaService);
    private hotelSelectFields;
    findHotelInfo(): Promise<Hotel>;
    findAllAmenities(): Promise<{
        id: string;
        name: string;
    }[]>;
    createOrUpdateHotel(dto: CreateHotelDto): Promise<Hotel>;
}
