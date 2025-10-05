"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let HotelService = class HotelService {
    constructor(prisma) {
        this.prisma = prisma;
        this.hotelSelectFields = {
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
    }
    async findHotelInfo() {
        const hotel = await this.prisma.hotel.findFirst({
            select: {
                ...this.hotelSelectFields,
                amenities: { include: { amenity: true } },
            },
        });
        if (!hotel) {
            throw new common_1.NotFoundException("Data Hotel H belum diinisialisasi.");
        }
        return hotel;
    }
    async findAllAmenities() {
        return this.prisma.amenity.findMany();
    }
    async createOrUpdateHotel(dto) {
        const existingHotel = await this.prisma.hotel.findFirst();
        const hotelId = existingHotel?.id;
        const amenityConnect = [];
        if (dto.amenityNames && dto.amenityNames.length > 0) {
            for (const name of dto.amenityNames) {
                let amenity = await this.prisma.amenity.findUnique({ where: { name } });
                if (!amenity) {
                    amenity = await this.prisma.amenity.create({ data: { name } });
                }
                amenityConnect.push(amenity.id);
            }
        }
        const { amenityNames, ...dataToSave } = dto;
        if (hotelId) {
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
                select: {
                    ...this.hotelSelectFields,
                    amenities: { include: { amenity: true } },
                },
            });
        }
        else {
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
                select: {
                    ...this.hotelSelectFields,
                    amenities: { include: { amenity: true } },
                },
            });
        }
    }
};
exports.HotelService = HotelService;
exports.HotelService = HotelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HotelService);
//# sourceMappingURL=hotel.service.js.map