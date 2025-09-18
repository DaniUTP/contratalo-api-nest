import * as bcrypt from 'bcrypt';

export class PasswordUtil {
    public static async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    };
    public static async comparePassword(password: string, hashPassword: string) {
        return await bcrypt.compare(password, hashPassword);
    };
}