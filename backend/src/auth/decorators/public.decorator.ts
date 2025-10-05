import { SetMetadata } from "@nestjs/common";

// Kunci metadata yang akan digunakan oleh Guard
export const IS_PUBLIC_KEY = "isPublic";

/**
 * Decorator kustom untuk menandai route sebagai "Public" (dapat diakses tanpa JWT).
 *
 * Ini biasanya digunakan dalam kombinasi dengan JwtAuthGuard global yang diatur
 * sebagai default untuk seluruh aplikasi. Guard akan memeriksa metadata 'isPublic'.
 *
 * @returns {MethodDecorator}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
