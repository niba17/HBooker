import { HotelService } from "../services/hotel.service";
import { CreateHotelDto } from "../dto/create-hotel.dto";
import { Hotel } from "@generated/prisma";
export declare class HotelController {
    private readonly hotelService;
    constructor(hotelService: HotelService);
    getHotelInfo(): Promise<Hotel>;
    getAllAmenities(): Promise<{
        id: string;
        name: string;
    }[]>;
    createOrUpdateHotel(createHotelDto: CreateHotelDto): Promise<Hotel>;
}
