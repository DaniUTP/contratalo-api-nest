import { randomBytes } from "crypto";

export class RandomLetterUtil {
    public static generateRandomLowercase(length: number = 6): string {
        return randomBytes(length)
            .toString('base64')
            .replace(/[+/=]/g, '')
            .toLowerCase()
            .substring(0, length);
    }
}